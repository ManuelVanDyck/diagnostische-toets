import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { renderKatex } from '../lib/katex-utils'
import { SUBS } from './GebiedBIntro'

interface Vraag { id: string; sub_gebied: string; niveau: number; type: string; vraag_html: string; keuzes_json: any; juist_antwoord: string; tolerantie: number | null; uitleg_html: string | null }

export default function GebiedBToets() {
  const [searchParams] = useSearchParams()
  const sessieId = searchParams.get('sessie')

  const [huidigeVraag, setHuidigeVraag] = useState<Vraag | null>(null)
  const [gekozenAntwoord, setGekozenAntwoord] = useState('')
  const [antwoordStatus, setAntwoordStatus] = useState<'kies' | 'feedback'>('kies')
  const [laatsteCorrect, setLaatsteCorrect] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Sub-gebied tracking: per sub houden we bij: actief, huidig niveau, of er al een fout is op dit niveau
  const [subState, setSubState] = useState<Record<string, { actief: boolean; niveau: number; foutOpNiveau: boolean; klaar: boolean }>>({
    eigenschappen: { actief: true, niveau: 1, foutOpNiveau: false, klaar: false },
    volgorde: { actief: true, niveau: 1, foutOpNiveau: false, klaar: false },
    machten: { actief: true, niveau: 1, foutOpNiveau: false, klaar: false },
    wortels: { actief: true, niveau: 1, foutOpNiveau: false, klaar: false },
  })
  const [currentLevel, setCurrentLevel] = useState(1)
  const [afgerond, setAfgerond] = useState(false)

  const subKeys = ['eigenschappen', 'volgorde', 'machten', 'wortels']

  // Laad eerste vraag of check of sessie al afgerond is
  useEffect(() => {
    if (!sessieId) return
    supabase.from('toets_sessies').select('status').eq('id', sessieId).single().then(({ data }) => {
      if (data?.status === 'afgerond') setAfgerond(true)
      else laadVraag(subKeys[0], 1)
    })
  }, [sessieId])

  const laadVraag = async (sub: string, _niveau: number) => {
    setLoading(true)
    const { data: vraagId } = await supabase.rpc('volgende_vraag_sub', {
      p_sessie_id: sessieId, p_gebied: 'B', p_sub_gebied: sub
    })
    if (!vraagId) {
      // Dit sub-gebied is klaar of heeft geen vragen meer
      setSubState(prev => ({ ...prev, [sub]: { ...prev[sub], klaar: true } }))
      moveToNext(sub)
      return
    }
    const { data: vraag } = await supabase.from('vragen').select('*').eq('id', vraagId).single()
    if (vraag) {
      setHuidigeVraag(vraag)
      setGekozenAntwoord('')
      setAntwoordStatus('kies')
    }
    setLoading(false)
  }

  const verstuurAntwoord = async () => {
    if (!sessieId || !huidigeVraag) return
    let isCorrect = false
    if (huidigeVraag.type === 'invul') {
      if (huidigeVraag.tolerantie === null || huidigeVraag.tolerantie === undefined) {
        // Tekst-antwoord: exacte vergelijking (case-insensitive, zonder spaties)
        const g = gekozenAntwoord.trim().replace(/\s+/g, '').toLowerCase()
        const j = huidigeVraag.juist_antwoord.trim().replace(/\s+/g, '').toLowerCase()
        isCorrect = g === j
      } else {
        const t = huidigeVraag.tolerantie || 0.001
        const g = parseFloat(gekozenAntwoord.replace(',', '.'))
        const j = parseFloat(huidigeVraag.juist_antwoord)
        isCorrect = !isNaN(g) && !isNaN(j) && Math.abs(g - j) <= t
      }
    } else if (huidigeVraag.type === 'meerkeuze_meervoudig') {
      const gegeven = gekozenAntwoord.split(',').map(s => s.trim()).filter(s => s).sort().join(',')
      const juist = huidigeVraag.juist_antwoord.split(',').map(s => s.trim()).sort().join(',')
      isCorrect = gegeven === juist
    } else {
      isCorrect = gekozenAntwoord.trim() === huidigeVraag.juist_antwoord.trim()
    }

    await supabase.from('antwoorden').insert({
      sessie_id: sessieId, vraag_id: huidigeVraag.id, gebied: 'B',
      gegeven_antwoord: gekozenAntwoord, is_correct: isCorrect, stap: currentLevel
    })
    setLaatsteCorrect(isCorrect)
    setAntwoordStatus('feedback')
  }

  const volgendeVraag = async () => {
    if (!huidigeVraag) return
    const sub = huidigeVraag.sub_gebied

    if (antwoordStatus !== 'feedback') return

    if (laatsteCorrect) {
      setSubState(prev => ({ ...prev, [sub]: { ...prev[sub], klaar: true, foutOpNiveau: false } }))
      moveToNext(sub)
    } else {
      if (subState[sub].foutOpNiveau) {
        const eindNiv = subState[sub].niveau - 1
        setSubState(prev => ({ ...prev, [sub]: { ...prev[sub], actief: false, klaar: true, niveau: Math.max(0, eindNiv) } }))
        moveToNext(sub)
      } else {
        // Eerste fout → herkansing zelfde niveau
        setSubState(prev => ({ ...prev, [sub]: { ...prev[sub], foutOpNiveau: true } }))
        laadVraag(sub, subState[sub].niveau)
      }
    }
  }

  const moveToNext = async (fromSub: string) => {
    const fromIdx = subKeys.indexOf(fromSub)
    // Zoek volgende actieve sub
    for (let i = fromIdx + 1; i < subKeys.length; i++) {
      const s = subState[subKeys[i]]
      if (s.actief && !s.klaar) {
        laadVraag(subKeys[i], s.niveau)
        return
      }
    }
    // Alle subs in deze ronde gedaan → check of we naar volgend niveau gaan
    const nogActief = subKeys.some(k => subState[k].actief)
    if (!nogActief) {
      voltooiToets()
      return
    }
    // Start nieuwe ronde: reset klaar, verhoog niveau voor actieve subs
    const newLvl = currentLevel + 1
    if (newLvl > 5) { voltooiToets(); return }
    setCurrentLevel(newLvl)
    setSubState(prev => {
      const updated = { ...prev }
      for (const k of subKeys) {
        if (updated[k].actief) {
          // Reset klaar, verhoog niveau, reset fout
          updated[k] = { ...updated[k], klaar: false, niveau: newLvl, foutOpNiveau: false }
        }
      }
      return updated
    })
    // Start met eerste actieve sub op nieuw niveau
    for (const k of subKeys) {
      if (subState[k].actief) {
        laadVraag(k, newLvl)
        return
      }
    }
    voltooiToets()
  }

  const voltooiToets = async () => {
    const user = (await supabase.auth.getUser()).data.user
    if (!user || !sessieId) return

    // Bereken niveau per sub en sla op
    // Haal antwoorden en vragen apart op
    const { data: alleAntw } = await supabase.from('antwoorden')
      .select('id,is_correct,vraag_id')
      .eq('sessie_id', sessieId)
    const { data: alleVragen } = await supabase.from('vragen')
      .select('id,sub_gebied')
      .eq('gebied', 'B')
    
    // Maak een lookup: vraag_id → sub_gebied
    const vraagSub: Record<string, string> = {}
    if (alleVragen) for (const v of alleVragen) vraagSub[v.id] = v.sub_gebied

    for (const sub of subKeys) {
      try {
        const { data: niveau, error: rpcErr } = await supabase.rpc('bereken_niveau_sub', {
          p_sessie_id: sessieId, p_gebied: 'B', p_sub_gebied: sub
        })
        if (rpcErr) console.error('RPC error', sub, rpcErr)

        const subAntw = (alleAntw || []).filter((a: any) => vraagSub[a.vraag_id] === sub)
        const tot = subAntw.length
        const correct = subAntw.filter((a: any) => a.is_correct).length

        const { error: upsertErr } = await supabase.from('resultaten').upsert({
          sessie_id: sessieId, leerling_id: user.id, gebied: 'B', sub_gebied: sub,
          beheersingsniveau: niveau || 0, aantal_vragen: tot, aantal_correct: correct
        }, { onConflict: 'sessie_id,sub_gebied' })
        if (upsertErr) console.error('Upsert error', sub, upsertErr)
      } catch (e) {
        console.error('voltooiToets error', sub, e)
      }
    }

    await supabase.from('toets_sessies').update({ status: 'afgerond', beeindigd_op: new Date().toISOString() }).eq('id', sessieId)
    setAfgerond(true)
  }

  if (afgerond) return <GebiedBResultaat sessieId={sessieId!} subState={subState} />

  if (loading && !huidigeVraag) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Vraag laden...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress bar */}
        <div className="flex gap-1 mb-4">
          {subKeys.map(k => {
            const s = subState[k]
            const subInfo = SUBS.find(x => x.key === k)
            return (
              <div key={k} className={`flex-1 h-2 rounded-full ${
                s.klaar ? (s.niveau >= 3 ? 'bg-green-400' : s.niveau >= 1 ? 'bg-yellow-400' : 'bg-red-400')
                : s.actief ? 'bg-indigo-400' : 'bg-gray-300'
              }`} title={`${subInfo?.naam}: niv ${s.niveau}`} />
            )
          })}
        </div>

        {huidigeVraag && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                {SUBS.find(s => s.key === huidigeVraag.sub_gebied)?.naam}
              </span>
              <span className="text-xs text-gray-400">Niveau {huidigeVraag.niveau}</span>
            </div>

            <div className="prose max-w-none text-gray-800 mb-6 text-lg"
              dangerouslySetInnerHTML={{ __html: renderKatex(huidigeVraag.vraag_html) }} />

            {huidigeVraag.type === 'meerkeuze' && huidigeVraag.keuzes_json && (
              <div className="space-y-3">
                {huidigeVraag.keuzes_json.map((keuze: any, i: number) => {
                  const isJuist = keuze.waarde === huidigeVraag.juist_antwoord
                  let knop = 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50'
                  if (antwoordStatus === 'feedback') {
                    if (isJuist) knop = 'border-green-400 bg-green-50'
                    else if (keuze.waarde === gekozenAntwoord) knop = 'border-red-400 bg-red-50'
                  } else if (keuze.waarde === gekozenAntwoord) knop = 'border-indigo-400 bg-indigo-50'
                  return (
                    <button key={i} onClick={() => antwoordStatus === 'kies' && setGekozenAntwoord(keuze.waarde)}
                      disabled={antwoordStatus !== 'kies'}
                      className={`w-full text-left p-4 rounded-xl border-2 transition ${knop}`}>
                      <span dangerouslySetInnerHTML={{ __html: renderKatex(keuze.label) }} />
                    </button>
                  )
                })}
              </div>
            )}
            {huidigeVraag.type === 'invul' && (
              <input type="text" value={gekozenAntwoord} onChange={e => setGekozenAntwoord(e.target.value)}
                disabled={antwoordStatus !== 'kies'}
                onKeyDown={e => e.key === 'Enter' && antwoordStatus === 'kies' && verstuurAntwoord()}
                placeholder="Jouw antwoord..." className="w-full p-4 text-lg rounded-xl border-2 border-gray-200 focus:border-indigo-400 outline-none" autoFocus />
            )}

            {/* Meerkeuze meervoudig */}
            {huidigeVraag.type === 'meerkeuze_meervoudig' && huidigeVraag.keuzes_json && (
              <div className="space-y-3">
                <p className="text-sm text-gray-500 mb-2">Selecteer alle juiste uitspraken:</p>
                {huidigeVraag.keuzes_json.map((keuze: any, i: number) => {
                  const geselecteerd = gekozenAntwoord.split(',').includes(keuze.waarde)
                  const juisteSet = huidigeVraag.juist_antwoord.split(',').map(s => s.trim())
                  const isJuist = juisteSet.includes(keuze.waarde)
                  let kn = 'border-gray-200 hover:border-indigo-400'
                  if (antwoordStatus === 'feedback') {
                    if (isJuist && geselecteerd) kn = 'border-green-400 bg-green-50'
                    else if (isJuist && !geselecteerd) kn = 'border-yellow-400 bg-yellow-50'
                    else if (!isJuist && geselecteerd) kn = 'border-red-400 bg-red-50'
                  } else if (geselecteerd) kn = 'border-indigo-400 bg-indigo-50'
                  return (
                    <button key={i} onClick={() => {
                      if (antwoordStatus !== 'kies') return
                      const h = gekozenAntwoord.split(',').filter(s => s)
                      setGekozenAntwoord(h.includes(keuze.waarde) ? h.filter(s => s !== keuze.waarde).join(',') : [...h, keuze.waarde].join(','))
                    }} disabled={antwoordStatus !== 'kies'}
                      className={`w-full text-left p-4 rounded-xl border-2 transition flex items-center gap-3 ${kn}`}>
                      <span className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center text-xs font-bold ${geselecteerd ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-gray-300'}`}>{geselecteerd ? '✓' : ''}</span>
                      <span dangerouslySetInnerHTML={{ __html: renderKatex(keuze.label) }} />
                    </button>
                  )
                })}
              </div>
            )}

            {/* Toon juist antwoord na feedback */}
            {antwoordStatus === 'feedback' && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-sm font-medium text-blue-700">Juiste antwoord: </span>
                <span className="text-sm text-blue-800" dangerouslySetInnerHTML={{ __html: renderKatex(
                  huidigeVraag.keuzes_json 
                    ? (huidigeVraag.keuzes_json.find((k: any) => k.waarde === huidigeVraag.juist_antwoord)?.label || huidigeVraag.juist_antwoord)
                    : '$' + huidigeVraag.juist_antwoord + '$'
                ) }} />
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3">
          {antwoordStatus === 'kies' && (
            <button onClick={verstuurAntwoord} disabled={!gekozenAntwoord}
              className="flex-1 py-3 px-6 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium disabled:opacity-50">
              Antwoord controleren
            </button>
          )}
          {antwoordStatus === 'feedback' && (
            <button onClick={volgendeVraag}
              className="flex-1 py-3 px-6 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium">
              Volgende vraag →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Resultaat component voor Gebied B
function GebiedBResultaat({ sessieId }: { sessieId: string, subState?: any }) {
  const navigate = useNavigate()
  const [resultaten, setResultaten] = useState<any>(null)

  useEffect(() => {
    supabase.from('resultaten').select('*').eq('sessie_id', sessieId).then(({ data }) => setResultaten(data))
  }, [])

  const SUB_FEEDBACK: Record<string, Record<number, { kan: string; werk_aan: string }>> = {
    eigenschappen: {
      0: { kan: 'Je herkent nog geen eigenschappen.', werk_aan: 'Oefen commutativiteit, associativiteit en distributiviteit met eenvoudige voorbeelden.' },
      1: { kan: 'Je herkent de basisbegrippen commutativiteit en associativiteit.', werk_aan: 'Leer ook de distributieve eigenschap en neutraal element herkennen.' },
      2: { kan: 'Je past de distributieve eigenschap toe en herkent het neutraal element.', werk_aan: 'Werk aan symmetrische en opslorpende elementen.' },
      3: { kan: 'Je bewijst dat bewerkingen niet-commutatief kunnen zijn.', werk_aan: 'Oefen met complexere combinaties van eigenschappen.' },
      4: { kan: 'Je combineert meerdere eigenschappen in complexe opgaven.', werk_aan: 'Verdiep je in abstracte bewijsvoering met eigenschappen.' },
      5: { kan: 'Je beheerst alle eigenschappen en past ze toe in onbekende situaties.', werk_aan: 'Blijf oefenen met open vragen en redeneringen.' },
    },
    volgorde: {
      0: { kan: 'Je past de volgorde nog niet correct toe.', werk_aan: 'Leer HMWVDOA: Haakjes, Machten/Wortels, Vermenigvuldigen/Delen, Optellen/Aftrekken.' },
      1: { kan: 'Je past de basisvolgorde toe (eerst vermenigvuldigen dan optellen).', werk_aan: 'Oefen met machten en haakjes in de volgorde.' },
      2: { kan: 'Je past de volgorde toe met haakjes, vermenigvuldigen en optellen.', werk_aan: 'Voeg machten en wortels toe aan de volgorde-oefeningen.' },
      3: { kan: 'Je combineert haakjes, machten, wortels in de juiste volgorde.', werk_aan: 'Werk aan complexere combinaties met negatieve getallen.' },
      4: { kan: 'Je lost complexe volgorde-opgaven op met alle bewerkingen.', werk_aan: 'Oefen met opgaven waar meerdere haakjes en machten gecombineerd worden.' },
      5: { kan: 'Je beheerst de volledige volgorde foutloos.', werk_aan: 'Blijf alert op valkuilen zoals -a^2 vs (-a)^2.' },
    },
    machten: {
      0: { kan: 'Je kent de rekenregels voor machten nog niet.', werk_aan: 'Begin met a^m * a^n = a^(m+n) en a^0 = 1.' },
      1: { kan: 'Je kent de basisregels: productregel en a^0.', werk_aan: 'Leer ook de quotientregel en macht van een macht.' },
      2: { kan: 'Je past product- en quotientregel toe op eenvoudige machten.', werk_aan: 'Oefen met negatieve exponenten en macht van een macht.' },
      3: { kan: 'Je werkt met negatieve exponenten en combineert meerdere regels.', werk_aan: 'Oefen met het vereenvoudigen van complexe machtsuitdrukkingen.' },
      4: { kan: 'Je combineert alle machtsregels in complexe uitdrukkingen.', werk_aan: 'Werk aan opgaven met variabelen zoals (a^2)^3 * a^(-4).' },
      5: { kan: 'Je beheerst alle machtsregels volledig.', werk_aan: 'Blijf oefenen met uitdagende combinaties van regels.' },
    },
    wortels: {
      0: { kan: 'Je kent de rekenregels voor vierkantswortels nog niet.', werk_aan: 'Begin met sqrt(a)*sqrt(b)=sqrt(ab) en vereenvoudigen.' },
      1: { kan: 'Je kent sqrt(81)=9 en herkent de productregel.', werk_aan: 'Leer wortels vereenvoudigen zoals sqrt(50)=5*sqrt(2).' },
      2: { kan: 'Je vereenvoudigt eenvoudige wortels en past de productregel toe.', werk_aan: 'Oefen met optellen en aftrekken van gelijksoortige wortels.' },
      3: { kan: 'Je combineert wortels in bewerkingen en vereenvoudigt correct.', werk_aan: 'Werk aan deling door wortels en het vereenvoudigen van breuken met wortels.' },
      4: { kan: 'Je lost complexe opgaven met wortels op.', werk_aan: 'Oefen met opgaven die wortels combineren met machten en haakjes.' },
      5: { kan: 'Je beheerst alle wortelregels volledig in complexe situaties.', werk_aan: 'Blijf oefenen met onbekende combinaties van wortels.' },
    },
  }

  if (!resultaten) return <div className="min-h-screen flex items-center justify-center text-gray-500">Resultaten laden...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Jouw resultaat — Gebied B</h1>
        <p className="text-gray-500 mb-6">Bewerkingen & Rekenregels</p>
        {SUBS.map(subInfo => {
          const r = resultaten.find((x: any) => x.sub_gebied === subInfo.key)
          if (!r) return null
          const fb = SUB_FEEDBACK[subInfo.key]?.[r.beheersingsniveau]
          return (
            <div key={subInfo.key} className="bg-white rounded-xl shadow-sm p-4 mb-3">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-800">{subInfo.icon} {subInfo.naam}</span>
                <span className={`text-2xl`}>{['🔴','🟠','🟡','🟢','🔵','🟣'][r.beheersingsniveau]}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mb-3">
                <span>Niveau {r.beheersingsniveau}/5</span>
                <span>{r.aantal_correct}/{r.aantal_vragen} correct</span>
              </div>
              {fb && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm space-y-1">
                  <p>✅ <span className="font-medium text-green-700">Wat je al kan:</span> {fb.kan}</p>
                  <p>🎯 <span className="font-medium text-blue-700">Waar je nog aan kan werken:</span> {fb.werk_aan}</p>
                </div>
              )}
            </div>
          )
        })}
        <button onClick={() => navigate('/')} className="w-full mt-6 py-3 px-6 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium">
          Terug naar overzicht
        </button>
      </div>
    </div>
  )
}

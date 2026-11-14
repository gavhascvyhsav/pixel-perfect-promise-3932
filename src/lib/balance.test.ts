import {describe,it,expect} from 'vitest'
import {alternatives,defaults,initialProfile,slots,workoutPlan} from './balance'
describe('Regole MyBalance',()=>{
 it('prevede cinque pasti giornalieri',()=>expect(slots).toHaveLength(5))
 it('offre tre alternative senza il piatto attuale',()=>{const result=alternatives(2,'pasta',[]);expect(result).toHaveLength(3);expect(result.map(d=>d.id)).not.toContain('pasta')})
 it('esclude ingredienti non graditi',()=>expect(alternatives(2,'pasta',['salmone']).some(d=>d.ingredients.includes('Salmone'))).toBe(false))
 it('sostituire un piatto non modifica gli altri quattro',()=>{const changed=defaults.map((d,i)=>i===2?'rice':d);expect(changed).toEqual(['yogurt','fruit','rice','toast','salmon'])})
 it('ha quattro giorni di attività e tre di recupero',()=>{expect(['2026-11-16','2026-11-18','2026-11-20','2026-11-21'].map(d=>workoutPlan(d).title)).not.toContain('Recupero e riposo');expect(['2026-11-17','2026-11-19','2026-11-22'].map(d=>workoutPlan(d).title)).toEqual(Array(3).fill('Recupero e riposo'))})
 it('mantiene i dati iniziali dichiarati senza peso obiettivo',()=>{expect(initialProfile).toMatchObject({age:15,sex:'Maschio',height:170,initial_weight:123});expect(initialProfile).not.toHaveProperty('target_weight')})
})
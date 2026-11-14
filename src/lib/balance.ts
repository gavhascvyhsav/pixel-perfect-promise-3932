import breakfast from '@/assets/breakfast.jpg'
import lunch from '@/assets/lunch.jpg'
import dinner from '@/assets/dinner.jpg'
import snack from '@/assets/snack.jpg'

export const slots = ['Colazione', 'Spuntino', 'Pranzo', 'Merenda', 'Cena']
export const times = ['08:00', '10:30', '13:00', '16:30', '20:00']
export type Dish = { id: string; name: string; description: string; ingredients: string[]; image: string; slots: number[] }
export const dishes: Dish[] = [
 {id:'yogurt',name:'Yogurt, avena e frutti di bosco',description:'Una combinazione fresca e colorata per iniziare la giornata.',ingredients:['Yogurt','Avena','Fragole','Mirtilli'],image:breakfast,slots:[0,1,3]},
 {id:'toast',name:'Pane, ricotta e mela',description:'Pane tostato con ricotta e frutta fresca.',ingredients:['Pane integrale','Ricotta','Mela'],image:snack,slots:[0,1,3]},
 {id:'fruit',name:'Frutta fresca e mandorle',description:'Frutta di stagione accompagnata da mandorle.',ingredients:['Mela','Mandorle'],image:snack,slots:[1,3]},
 {id:'milk',name:'Latte, pane e frutta',description:'Una colazione semplice con pane e frutta di stagione.',ingredients:['Latte','Pane integrale','Mela'],image:breakfast,slots:[0,1,3]},
 {id:'pasta',name:'Pasta con ceci e pomodorini',description:'Pasta integrale con ceci, pomodorini e basilico fresco.',ingredients:['Pasta integrale','Ceci','Pomodorini','Basilico','Olio di oliva'],image:lunch,slots:[2,4]},
 {id:'salmon',name:'Salmone, patate e broccoli',description:'Salmone al forno con patate e verdure di stagione.',ingredients:['Salmone','Patate','Broccoli','Olio di oliva'],image:dinner,slots:[2,4]},
 {id:'rice',name:'Riso con verdure e fagioli',description:'Riso accompagnato da verdure e legumi.',ingredients:['Riso','Zucchine','Fagioli','Olio di oliva'],image:lunch,slots:[2,4]},
 {id:'eggs',name:'Uova, pane e verdure',description:'Uova accompagnate da pane e verdure cotte.',ingredients:['Uova','Pane integrale','Broccoli','Olio di oliva'],image:dinner,slots:[2,4]},
 {id:'pear',name:'Pera e yogurt naturale',description:'Un abbinamento delicato di frutta e yogurt.',ingredients:['Pera','Yogurt'],image:breakfast,slots:[0,1,3]},
]
export const defaults = ['yogurt','fruit','pasta','toast','salmon']
export function alternatives(slot:number,current:string,excluded:string[]) {return dishes.filter(d=>d.slots.includes(slot)&&d.id!==current&&!d.ingredients.some(i=>excluded.some(e=>i.toLowerCase().includes(e.trim().toLowerCase())))).slice(0,3)}
export function dateKey(date = new Date()) {return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`}
export function weekDates(date:string){const d=new Date(date+'T12:00:00');d.setDate(d.getDate()-((d.getDay()+6)%7));return Array.from({length:7},(_,i)=>{const day=new Date(d);day.setDate(d.getDate()+i);return dateKey(day)})}
export function workoutPlan(date:string){const day=new Date(date+'T12:00:00').getDay();const plans:Record<number,{title:string;exercises:string[]}>={1:{title:'Primi passi in palestra',exercises:['Familiarizzazione con la palestra','Macchinari guidati con istruttore','Mobilità e apprendimento della tecnica']},3:{title:'Tecnica e movimento',exercises:['Tecnica degli esercizi con istruttore','Movimenti controllati','Esercizi guidati']},5:{title:'Movimento a basso impatto',exercises:['Attività aerobica a basso impatto','Esercizi supervisionati','Defaticamento']},6:{title:'Un po’ di movimento all’aperto',exercises:['Passeggiata','Bicicletta tranquilla','Attività leggera a scelta']}};return plans[day]??{title:'Recupero e riposo',exercises:['Riposo','Eventuale movimento leggero, se concordato']}}
export const initialProfile = {name:'',age:15,sex:'Maschio',height:170,initial_weight:123,professional_notes:''}
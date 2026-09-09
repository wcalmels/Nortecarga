"use client";

import { useMemo, useState } from "react";

type Market = "cargas" | "camiones" | "empleos";

const loads = [
  { id:"CG-1048", from:"Iquique", to:"Santiago", date:"28 Ago", type:"Carga general", equipment:"Rampla plana", weight:"22 t", price:"$1.850.000", offers:5, match:96, company:"Comercial Atacama", verified:true, urgent:false },
  { id:"CG-1051", from:"Antofagasta", to:"Calama", date:"Hoy, 18:00", type:"Insumos mineros", equipment:"Cama baja", weight:"31 t", price:"A convenir", offers:2, match:89, company:"Servicios del Desierto", verified:true, urgent:true },
  { id:"CG-1056", from:"Santiago", to:"Iquique", date:"31 Ago", type:"Pallets industriales", equipment:"Semirremolque cerrado", weight:"18 t", price:"$1.690.000", offers:8, match:84, company:"Distribución Centro", verified:false, urgent:false },
  { id:"CG-1059", from:"Arica", to:"La Serena", date:"02 Sep", type:"Carga parcial", equipment:"Camión 3/4", weight:"4,5 t", price:"$780.000", offers:3, match:78, company:"Importadora Norte", verified:true, urgent:false },
];

const trucks = [
  { id:"TR-284", owner:"Transportes Rojas", route:"Iquique → Santiago", available:"30 Ago", equipment:"Tracto + rampla plana", capacity:"24 t", rating:"4,9", trips:86, match:94, verified:true },
  { id:"TR-301", owner:"Logística Tamarugal", route:"Antofagasta → Santiago", available:"Hoy", equipment:"Semirremolque cerrado", capacity:"18 t", rating:"4,7", trips:43, match:88, verified:true },
  { id:"TR-318", owner:"Juan M. Salinas", route:"Arica → Zona Centro", available:"01 Sep", equipment:"Camión 3/4", capacity:"5 t", rating:"4,8", trips:29, match:82, verified:true },
];

const jobs = [
  { id:"EM-091", title:"Conductor A5 · Ruta norte", company:"Transportes Rojas", base:"Iquique", contract:"Plazo indefinido", salary:"$1.350.000 – $1.650.000", applicants:12, match:95, verified:true },
  { id:"EM-094", title:"Conductor A5 de reemplazo", company:"Logística Tamarugal", base:"Antofagasta", contract:"Reemplazo · 14 días", salary:"$780.000 período", applicants:7, match:87, verified:true },
  { id:"EM-097", title:"Conductor A4 distribución", company:"Distribución Centro", base:"Calama", contract:"Plazo fijo", salary:"$1.050.000 – $1.250.000", applicants:19, match:81, verified:false },
];

const nav: {id:Market; label:string; count:number}[] = [
  {id:"cargas",label:"Cargas",count:12},{id:"camiones",label:"Camiones",count:8},{id:"empleos",label:"Empleos",count:6}
];

export default function Dashboard(){
  const [market,setMarket]=useState<Market>("cargas");
  const [query,setQuery]=useState("");
  const [modal,setModal]=useState(false);
  const [notice,setNotice]=useState("");
  const data = useMemo(()=>{
    const q=query.toLowerCase();
    if(market==="cargas") return loads.filter(x=>`${x.from} ${x.to} ${x.type} ${x.company}`.toLowerCase().includes(q));
    if(market==="camiones") return trucks.filter(x=>`${x.owner} ${x.route} ${x.equipment}`.toLowerCase().includes(q));
    return jobs.filter(x=>`${x.title} ${x.company} ${x.base}`.toLowerCase().includes(q));
  },[market,query]);

  const publishLabel=market==="cargas"?"Publicar carga":market==="camiones"?"Ofrecer camión":"Publicar empleo";

  function saveDemo(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setModal(false);setNotice("Borrador guardado para revisión. No se publicó ninguna oferta.");setTimeout(()=>setNotice(""),5000)}

  return <div className="appShell">
    <aside className="sidebar">
      <div className="logo"><span>NC</span><div>NorteCarga<small>RED OPERACIONAL</small></div></div>
      <div className="workspace"><span>OPERACIÓN</span><button className="active">⌂ <b>Vista general</b></button><button>⌁ <b>Viajes en curso</b><em>4</em></button><button>✓ <b>Revisión documental</b><em className="warn">3</em></button></div>
      <div className="workspace"><span>MERCADO</span>{nav.map(item=><button key={item.id} onClick={()=>setMarket(item.id)} className={market===item.id?"active":""}><i>{item.id==="cargas"?"▣":item.id==="camiones"?"▰":"◎"}</i><b>{item.label}</b><em>{item.count}</em></button>)}</div>
      <div className="workspace"><span>GESTIÓN</span><button>◇ <b>Empresas</b></button><button>♙ <b>Conductores</b></button><button>▤ <b>Auditoría</b></button></div>
      <div className="sidebarFooter"><div className="avatar">WC</div><div><b>Walter Calmels</b><small>Coordinador</small></div><button aria-label="Configuración">•••</button></div>
    </aside>

    <main className="workspaceMain">
      <header className="mainHeader"><div><p>PILOTO PRIVADO · NORTE DE CHILE</p><h1>Buenos días, Walter.</h1></div><div className="headerActions"><button className="iconButton" aria-label="Notificaciones">♢<span /></button><button className="primary" onClick={()=>setModal(true)}>＋ {publishLabel}</button></div></header>

      <section className="metrics" aria-label="Resumen operacional">
        <article><div><span>CARGAS ABIERTAS</span><b>12</b></div><small className="up">↑ 3 esta semana</small><i>▣</i></article>
        <article><div><span>CAMIONES DISPONIBLES</span><b>8</b></div><small>5 con documentos OK</small><i>▰</i></article>
        <article><div><span>VIAJES EN CURSO</span><b>4</b></div><small>Todos dentro de plazo</small><i>↗</i></article>
        <article><div><span>MATCH PROMEDIO</span><b>89%</b></div><small className="up">↑ 6% vs. período anterior</small><i>◎</i></article>
      </section>

      <section className="marketSection">
        <div className="marketTop">
          <div className="tabs">{nav.map(item=><button key={item.id} className={market===item.id?"selected":""} onClick={()=>setMarket(item.id)}>{item.label}<span>{item.count}</span></button>)}</div>
          <label className="search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar ruta, empresa o equipo" /></label>
        </div>

        <div className="contentGrid">
          <div className="listPanel">
            <div className="listHeader"><div><h2>{market==="cargas"?"Cargas recomendadas":market==="camiones"?"Capacidad disponible":"Oportunidades laborales"}</h2><p>Ordenadas por compatibilidad y estado de verificación.</p></div><button>Filtros⌄</button></div>
            <div className="cards">
              {data.length===0&&<div className="empty"><b>Sin coincidencias</b><p>Prueba con otra ruta, empresa o tipo de equipo.</p></div>}
              {market==="cargas"&&data.map((raw)=>{const x=raw as typeof loads[number];return <article className="marketCard" key={x.id}>
                <div className="routeRow"><div className="route"><span>{x.from.slice(0,3).toUpperCase()}</span><i><b>━━━━</b>●</i><span>{x.to.slice(0,3).toUpperCase()}</span></div><div className="match"><b>{x.match}%</b><span>MATCH</span></div></div>
                <div className="placeRow"><span>{x.from}</span><small>{x.date}</small><span>{x.to}</span></div>
                <div className="detailRow"><span>{x.type}</span><span>{x.equipment}</span><span>{x.weight}</span></div>
                <div className="cardFooter"><div><b>{x.price}</b><small>{x.company} {x.verified&&<i>✓ verificada</i>}</small></div><div>{x.urgent&&<span className="urgent">URGENTE</span>}<span className="offerCount">{x.offers} ofertas</span><button onClick={()=>setNotice(`${x.id} abierto en modo demostración.`)}>Revisar</button></div></div>
              </article>})}
              {market==="camiones"&&data.map((raw)=>{const x=raw as typeof trucks[number];return <article className="marketCard compact" key={x.id}><div className="entityTop"><div className="truckBadge">▰</div><div><h3>{x.owner}</h3><p>{x.route}</p></div><div className="match"><b>{x.match}%</b><span>MATCH</span></div></div><div className="detailRow"><span>{x.equipment}</span><span>{x.capacity}</span><span>Disponible {x.available}</span></div><div className="cardFooter"><div><b>★ {x.rating}</b><small>{x.trips} viajes · ✓ documentos verificados</small></div><button onClick={()=>setNotice(`${x.id} abierto en modo demostración.`)}>Ver capacidad</button></div></article>})}
              {market==="empleos"&&data.map((raw)=>{const x=raw as typeof jobs[number];return <article className="marketCard compact" key={x.id}><div className="entityTop"><div className="jobBadge">◎</div><div><h3>{x.title}</h3><p>{x.company} · {x.base}</p></div><div className="match"><b>{x.match}%</b><span>MATCH</span></div></div><div className="detailRow"><span>{x.contract}</span><span>{x.salary}</span><span>{x.verified?"Empresa verificada":"Verificación pendiente"}</span></div><div className="cardFooter"><div><b>{x.applicants} postulantes</b><small>Postulación y contratación requieren revisión humana.</small></div><button onClick={()=>setNotice(`${x.id} abierto en modo demostración.`)}>Ver empleo</button></div></article>})}
            </div>
          </div>

          <aside className="rightPanel">
            <div className="panelTitle"><div><span className="spark">✦</span><div><h3>Matching asistido</h3><p>Recomendaciones del sistema</p></div></div><span className="shadow">SHADOW</span></div>
            <div className="suggestion"><span className="score">96</span><div><b>CG-1048 ↔ TR-284</b><p>Iquique → Santiago</p></div><small>ALTA</small></div>
            <ul className="reasons"><li><span>✓</span>Equipo y capacidad compatibles</li><li><span>✓</span>Documentos verificados</li><li><span>✓</span>Ruta habitual del transportista</li><li><span>✓</span>Historial de cumplimiento 94%</li></ul>
            <div className="decision"><p>El sistema <b>recomienda</b>. La adjudicación debe ser revisada por el coordinador y aprobada por el cliente.</p><button onClick={()=>setNotice("Comparación abierta. No se realizó ninguna adjudicación.")}>Comparar propuesta</button></div>
            <div className="alerts"><div><h3>Requieren atención</h3><span>3 pendientes</span></div><button><i className="orange">!</i><p><b>Licencia próxima a vencer</b><small>Conductor CR-118 · vence en 12 días</small></p><span>›</span></button><button><i className="red">!</i><p><b>Comprobante pendiente</b><small>Viaje VJ-0831 · hace 4 horas</small></p><span>›</span></button></div>
          </aside>
        </div>
      </section>
      <footer><span>NorteCarga Red v0.1</span><span>Piloto demostrativo · Sin operaciones reales</span><span>Shadow-first · Human-in-the-loop</span></footer>
    </main>

    {notice&&<div className="toast" role="status">✓ {notice}</div>}
    {modal&&<div className="modalBackdrop" onMouseDown={()=>setModal(false)}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={e=>e.stopPropagation()}>
      <div className="modalHead"><div><p>BORRADOR CONTROLADO</p><h2 id="modal-title">{publishLabel}</h2></div><button onClick={()=>setModal(false)} aria-label="Cerrar">×</button></div>
      <form onSubmit={saveDemo}><label>Origen<input required placeholder="Ej. Iquique" /></label><label>Destino<input required placeholder="Ej. Santiago" /></label><div className="formRow"><label>Fecha<input required type="date" /></label><label>{market==="empleos"?"Licencia requerida":"Tipo de equipo"}<select><option>{market==="empleos"?"A5":"Rampla plana"}</option><option>{market==="empleos"?"A4":"Semirremolque cerrado"}</option></select></label></div><label>Descripción<textarea required placeholder="Información necesaria para que la oferta pueda revisarse…" /></label><div className="guard"><span>⌾</span><p><b>No se publicará automáticamente.</b><br/>El borrador pasará por revisión documental y aprobación humana.</p></div><div className="modalActions"><button type="button" onClick={()=>setModal(false)}>Cancelar</button><button className="primary" type="submit">Guardar borrador</button></div></form>
    </div></div>}
  </div>
}

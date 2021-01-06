const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const htmlPdf = require("html-pdf");
const ruta_a_localidades = __dirname + "/localidades";
const cp = require("child_process");

/*

--- PLANTAS HECHAS ---

agave americana
agave bracteosa
allium ampeloprasum
allium cepa
amaranthus retroflexus

//*/



const __palabras_destacables__ = [
	/antidiarreica|antidiarreico/gi,
	/diarreico|diarreica|diarrea/gi,
	/flatulencia/gi,
	/laxante/gi,
	/infusión|infusiones/gi,
	/acantilado/gi,
	/litoral/gi,
	/ladera/gi,
	/rocoso|rocosa|roca/gi,
	/estómago|estomacal/gi,
	/colon/gi,
	/intestino|intestinal/gi,
	/microbiota/gi,
	/fibra/gi,
	/textil/gi,
	/purgante/gi,
	/fructana/gi,
	/diaforético|diaforética/gi,
	/ictericia/gi,
	/diurético|diurética/gi,
	/renal|riñón|riñones/gi,
	/urinario|urinaria|orina/gi,
	/astringente|astringencia/gi,
	/antiséptica|antiséptico|antiseptica|antiseptico/gi,
	/expectorante/gi,
	/intestino|intestinal/gi,
	/forrajero|forrajera|forraje/gi,
	/fitoestabilización|fitoestabilizante/gi,
	/antitumoral|tumoral|tumor/gi,
	/antiarrítmico|antiarrítmica|arrítmico|arrítmica/gi,
	/antiinflamatorio|antiinflamatoria|inflamatorio|inflamatoria|inflamación/gi,
	/analgésico|analgésica/gi,
	/hipertensión/gi,
	/osteoporosis/gi,
	/VIH/gi,
	/asma/gi,
	/escorbuto/gi,
	/eccema/gi,
	/dérmico|dérmica|dermis/gi,
	/dermatitis/gi,
	/piel/gi,
	/respiratorio|respiratoria|respiración/gi,
	/linfedema/gi,
	/hígado|hepático|hepática/gi,
	/antihemorrágico|antihemorrágica|hemorragia/gi,
	/colorante|coloración/gi,
	/antitusivo|antitusiva/gi,
	/sudorífica/gi,
	/cicatrizante|cicatriz|cicatrices/gi,
	/presión arterial/gi,
	/antiespasmódico|antiespasmódica/gi,
	/demulcente/gi,
	/indigestiva|indigestión|digestivo|digestiva/gi,
	/digestivo|digestiva/gi,
	/emoliente/gi,
	/laxante/gi,
	/oftálmica|oftálmico/gi,
	/purgativa|purgativo|purgante/gi,
	/tónico|tónica/gi,
	/herida/gi,
	/ampolla/gi,
	/quemadura|quemazón/gi,
	/furanocumarina/gi,
	/toxicidad|tóxico|tóxica/gi,
	/venenoso|venenosa|veneno/gi,
	/comestible|comida/gi,
	/alimento|alimenticio|alimenticia/gi,
	/tanino/gi,
	/poliacetilénico/gi,
	/saponócito/gi,
	/aceites esenciales|aceite esencial/gi,
	/ácidos orgánicos|ácido orgánico/gi,
	/saponina/gi,
	/saponósido/gi,
	/mucílago/gi,
	/antoxantina/gi,
	/miel/gi,
	/estéril/gi,
	/acidófilo|ácido/gi,
	/alcalino|alcalina|alcalinidad/gi,
	/drenada|drenado/gi,
	/calcáreo/gi,
	/jardinería|decoración|decorativo|decorativa|ornamento|ornamental/gi,
	/cataplasma|apósito/gi,
	/calcificado|calcificada|calcífugo|calcífuga/gi,
	/soleado|soleada/gi,
	/montaña|montañoso|monstañosa/gi,
	/húmedo|húmeda|humedad/gi,
	/sequedad|seco|seca|sequía/gi,
	/playa|costa|marítimo|marítima/gi,
	/desierto/gi,
	/Europa/gi,
	/África/gi,
	/América/gi,
	/Asia/gi,
	/Oceanía|Australia/gi,
	/tropical/gi,
	/oloroso|olorosa|olor/gi,
	/inodora|inodoro/gi,
	/árido|árida/gi,
	/alcohol|alcohólico|alcohólica|destilación|destilar|destila/gi,
	/zumo/gi,
	/azúcar|azucarado/gi,
	/disentería/gi,
	/pectina/gi,
	/piruvato/gi,
	/glucosa/gi,
	/amoniaco|amoníaco|amoniaca|amoníaca|amoniacal/gi,
	/irritación/gi,
	/ojo|ocular/gi,
	/caloría|calórico|calórica/gi,
	/etileno|etílico/gi,
	/quercetina/gi,
	/azufre/gi,
	/lacrimógeno|lacrimógena/gi,
	/antioxidante|oxidante/gi,
	/venenoso|venenosa/gi,
	/sabroso|sabrosa|sabor/gi,
	/bronquitis/gi,
	/farignitis/gi,
	/laringitis/gi,
	/antitusivo/gi,
	/acné/gi,
	/flavonoides/gi,
	/fenólico/gi,
	/rosmarín/gi,
	/tripertenos/gi,
	/timol/gi,
	/cimeno/gi,
	/carvacrol/gi,
	/terpina/gi,
	/borneol/gi,
	/linalol/gi,
	/luteolina/gi,
	/apigenina/gi,
	/naringenina/gi,
	/eriodictol/gi,
	/cirsilineol/gi,
	/salvigenina/gi,
	/cirsimaritina/gi,
	/timonina/gi,
	/timusina/gi,
	/cinámico/gi,
	/cafeico/gi,
	/ursólico/gi,
	/oleanólico/gi,
	/cáncer|cancerígeno|cancerígena/gi,
	/alcaloide/gi,
	/medicamento/gi,
	/farmacológico|farmacológica|farmacéutica|farmacéutico|farmacología/gi,
	/vinblastina/gi,
	/vincristina/gi,
	/vindesina/gi,
	/vinorelbina/gi,
	/ensalada/gi,
	/resistente|resistencia/gi,
	/dulce/gi,
	/salada|salado/gi,
	/amarga|amargo/gi,
	/vinos| vino/gi,
	/licores|licor/gi,
	/pastelería|repostería/gi,
	/postres|postre/gi,
	/mermeladas|mermelada/gi,
	/jalea/gi,
	/crecimiento rápido/gi,
	/invasivo|invasiva|invasora|invasor/gi,
	/setos/gi,
	/bosque/gi,
	/ribazo/gi,
	/bucales|bucal/gi,
	/vitamina/gi,
	/hierro/gi,
	/anemia/gi,
	/colesterol/gi,
	/cestería/gi,
	/cuerdas|cuerda/gi,
	/medicinal/gi,
	/alimenticio|alimenticia/gi,
	/agridulce/gi,
	/pacharán/gi,
	/drupa/gi,
	/fibra/gi,
	/tránsito intestinal/gi,
	/hidratos de carbono/gi,
	/potasio/gi,
	/hierro/gi,
	/calcio/gi,
	/antociano|antocianina/gi,
	/carotenoide/gi,
	/aromática|aromático/gi,
	/tisana/gi,
	/cosmético|cosmética/gi,
	/madera/gi,
	/tornería/gi,
	/antiepiléptico|antiepiléptica/gi,
	/vulneraria/gi,
	/afrodisíaca|afrodisíaco/gi,
	/hidropesía/gi,
	/absceso/gi,
	/colorante/gi,
	/biorremediación/gi,
	/tintura|tinte/gi,
	/furúnculo/gi,
	/enema/gi,
	/febrífugo|febrífuga|fiebre/gi,
	/arabinosa/gi,
	/ramnosa/gi,
	/cólico/gi,
	/emoliente/gi,
	/mucílago/gi,
	/gálico/gi,
	/pectina/gi,
	/rinantina/gi,
	/antiflogístico|antiflogística/gi,
	/resolvente/gi,
	/detersivo|detersiva/gi,
	/antiescorbútico|antiescorbútica/gi,
	/hemorroide/gi,
	/gargarismo/gi,
	/úlcera|ulceración|ulceracion/gi,
	/colitis/gi,
	/pirosis/gi,
	/eritema/gi,
	
];

const dd = (...args) => {
	console.log(...args);
	process.exit(0);
}

const nombre_bonito_de_planta = function(planta) {
	return planta.replace(/^[a-záéíóú]/g, item => item.toUpperCase()).replace(/\-/g, " ");
};

const page_break = `<div style="page-break-after: always; visibility: hidden"></div>`;

const tomar_html_basico = function() {
	return `
<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');
html {
	padding: 10px;
	font-family: Roboto, 'Sans-serif';
}
.info-planta,
.info-destacable-planta,
.enunciado {
	margin-top: 0;
	padding-top: 0;
	font-size: 10px;
}
.imagen-planta {
	max-height: 820px;
	max-width: 520px;
	width: auto;
	margin: 0 auto;
	vertical-align: top;
	margin-top: 0px;
	margin-bottom: 20px;
	border: 2px dashed #333;
	box-shadow: 0px 0px 10px black;
}
.centrado {
	text-align: center;
}
.enfasis {
	text-decoration: underline;
}
a {
	color: inherit;
	text-decoration: none;
}
a:hover {
	background-color: #333;
	color: white;
}
</style>
	`;
};

const descargar_pagina_de_planta_de_wikipedia = function(localidad, planta) {
	const ruta_a_wikipedia = `${ruta_a_localidades}/${localidad}/wikipedia/${planta}.html`;
	const ya_existe = fs.existsSync(ruta_a_wikipedia);
	if(ya_existe) {
		return fs.readFileSync(ruta_a_wikipedia).toString();
	}
	const url_de_planta = "https://es.wikipedia.org/wiki/" + planta.replace(/ |\-/g, "_");
	console.log("[*] Visitando página: " + url_de_planta);
	return new Promise(function(ok, fail) {
		const prepromesa = axios.get(url_de_planta).then(response => {
			fs.writeFileSync(ruta_a_wikipedia, response.data, "utf8");
			return ok(response.data);
		}).catch(error => {
			return ok(false);
		});
	});
}

const descargar_taxonomia_de_planta_de_wikipedia = function(page) {
	if(page === false) {
		return false;
	}
	const data = {};
	const $ = cheerio.load(page);
	const etiquetas = ["reino", "subreino", "división", "subclase", "orden", "familia", "subfamilia", "género", "especie"];
	const resultset = $("table.infobox th a, table.infobox td a");
	resultset.each(function(index, element) {
		const jThis = $(this);
		const label = jThis.text().toLowerCase().trim();
		const es_importante = etiquetas.indexOf(label) !== -1;
		if(es_importante) {
			const value = jThis.parent().next("td").text().trim()
				.replace(/,.*$/g, "")
				.replace(/\([a-zA-Z0-9.]+\)/g, "")
				.replace(/\[[0-9 ]*\]/g, "")
				.replace(/([a-z])[A-Z]+\.$/g, "$1").trim();
			data[label] = value;
		}
	});
	return data;
}

const extraer_palabras_destacables_de_wikipedia = function(page) {
	if(page === false) {
		return false;
	}
	let destacables = [];
	for(let index_destacable=0; index_destacable < __palabras_destacables__.length; index_destacable++) {
		const matcheable = __palabras_destacables__[index_destacable];
		const matcheos = page.match(matcheable);
		if(matcheos !== null) {
			destacables.push(matcheos[0]);
		}
	}
	return destacables;
}

const extraer_referencias_de_wikipedia = function (page) {
	if (page === false) {
		return false;
	}
	let referencias = false;
	const $ = cheerio.load(page);
	referencias = "<ul class='enunciado'>" + $("ol.references,ul.references").first().html() + "</ul>";
	return referencias;
}

const extraer_bibliografia_de_wikipedia = function (page) {
	if (page === false) {
		return false;
	}
	let referencias = false;
	const $ = cheerio.load(page);
	referencias = "<ul class='enunciado'>" + $("ol.references,ul.references").first().html() + "</ul>";
	return referencias;
}

const normalizar_texto = function(texto) {
	return texto
		.replace(/^Castellano: /g, "")
		.replace(/^Español: /g, "")
		.replace(/\([0-9]+\)/g, "")
		.replace(/\[[0-9]+\]/g, "")
		.replace(/\(el número entre paréntesis indica las especies que tienen el mismo nombre\)/g, "")
		.replace(/\(el número entre paréntesis indica las especies que tienen el mismo nombre( en España)?\)/g, "")
		.replace(/Las cifras entre paréntesis corresponden a la frecuencia del vocablo( en España)?(; en negrita y los más comunes)?\)/g, "")
		.replace(/\[cita requerida\]/g, "")
		.trim()
		.replace(/\.+$/g, "");
}

const extraer_nombres_populares = function(page, planta) {
	if(page === false) {
		return false;
	}
	const $ = cheerio.load(page);
	let nombres_populares;
	if ([
			"Parietaria judaica",
			"Pistacia lentiscus",
			"Sorghum halepense",
			"Antirrhinum majus"
		].indexOf(planta) !== -1) {
		const texto_bruto = $("#Nombres_comunes,#Nombre_comun,#Nombre_común,#Denominación_popular,#Denominacion_popular,#Denominaciones_populares,#Nombres_vernáculos,#Nombre_vernáculo,#Nombre_vernaculo,#Nombre_popular,#Nombres_populares,[title='Nombre común'],[title='Nombre comun'],#Nombres")
			.first()
			.closest("h2,h3")
			.first()
			.nextAll("p")
			.first()
			.text();
		nombres_populares = [
			normalizar_texto(texto_bruto)
		];
	} else {
		const texto_bruto = $("#Nombres_comunes,#Nombre_comun,#Nombre_común,#Denominación_popular,#Denominacion_popular,#Denominaciones_populares,#Nombres_vernáculos,#Nombre_vernáculo,#Nombre_vernaculo,#Nombre_popular,#Nombres_populares,[title='Nombre común'],[title='Nombre comun'],#Nombres")
			.first()
			.closest("h2,h3")
			.first()
			.nextAll("ul")
			.find("li")
			.first()
			.text();
		nombres_populares = normalizar_texto(texto_bruto).split(/ *, */g);
	}
	if((nombres_populares.length === 1) && (nombres_populares[0] === "")) {
		const texto_bruto = $("#Nombres_comunes,#Nombre_comun,#Nombre_común,#Denominación_popular,#Denominacion_popular,#Denominaciones_populares,#Nombres_vernáculos,#Nombre_vernáculo,#Nombre_vernaculo,#Nombre_popular,#Nombres_populares,[title='Nombre común'],[title='Nombre comun'],#Nombres")
			.first()
			.closest("h2")
			.nextAll("p")
			.first()
			.text();
		nombres_populares = normalizar_texto(texto_bruto).split(/ *, */g);
	}
	return nombres_populares;
}

const generar_libro = function(html_base, localidad, indice_de_plantas) {
	let html = tomar_html_basico();
	html += `<h1 class="centrado"><b>Flora local de ${localidad}</b></h1>`;
	html += `<br class="display: inline-block; width: 100%;"/>`;
	html += `<h3 class="centrado"><b>Compilación de los vegetales silvestres de la localidad de ${localidad}</b></h3>`;
	html += `<br class="display: inline-block; width: 100%;"/>`;
	html += `<h5 style="text-align: right;"><b>Por:</b> Carlos Jimeno Hernández</h5>`;
	html += `${page_break}`;
	html += `<h1>Importante nota del autor:</h1>`;
	html += `<div class="enunciado">`;
	html += `<p class="enfasis">El autor no se responsabiliza del mal uso que hagan los usuarios tanto de esta guía como de las plantas silvestres locales.</p>`;
	html += `<p>El presente libro ha sido generado de manera automática a partir de imágenes, nombres y un programa informático.</p>`;
	html += `<p>Es importante entender esto en el momento de consultar este libro por la siguiente razón.</p>`;
	html += `<p>Si en este libro aparece la palabra "<b>comestible</b>" asociada a una planta, NO se está diciendo que esta planta sea comestible.</p>`;
	html += `<p>Si en este libro aparece la palabra "<b>comestible</b>" asociada a una planta, SÍ se está diciendo que en la descripción de tal página web que se da sobre esta planta, aparece la palabra "<b>comestible</b>".</p>`;
	html += `<p>Pero el texto de esa página web podría ser, perfectamente: "<b>esta planta no es COMESTIBLE para las personas</b>".</p>`;
	html += `<p>Por esta razón, antes de hacer un uso de cualquiera de estas plantas, ruego que consulten antes fuentes de información fiables, o por lo menos <b>Wikipedia</b>, que es la fuente de información principal de este documento, y se supone cada entrada de plantas está revisada por entendidos del tema, como botánicos, biólogos, farmacólogos, químicos y personas con ciertos estudios reconocidos en la red de universidades del mundo, y que además son personas que participan, muchas de ellas, gratuitamente escribiendo y supervisando la calidad de la información de Wikipedia en sus respectivos temas.</p>`;
	html += `<p>La idea de este libro NO es ofrecer una guía culinaria, farmacológica, nutricional o química de la flora.</p>`;
	html += `<p>La idea de este libro SÍ es ofrecer una lista completa de nombres únicos (científicos) de las plantas que crecen de forma silvestre en el entorno, poder consultar las imágenes de las plantas, el nombre asociado y sus denominaciones populares, además de su clasificación botánica, y un pequeño vistazo no significativo de las ideas que se relacionaron con este vegetal en algún portal web concreto.</p>`;
	html += `<p>Por tanto, este documento está pensado para identificar las plantas silvestres, más que listar usos prácticos reales de cada una de estas plantas, lo cual lo considero otra tarea muy distinta, que podría ir cambiando con el tiempo.</p>`;
	html += `<p>En cambio, la planta y su nombre pueden permanecer, por muchos años, inmutable en la comunidad humana.</p>`;
	html += `<p>De ahí esta importante nota, con la que quiero decir que no me responsabilizo del mal uso que hagan los usuarios tanto de esta guía como de las plantas silvestres locales.</p>`;
	html += `<p>Pero no hace falta decir que algunas plantas aquí presentes son muy útiles en industrias muy diferentes, y si visitan los enlaces de Wikipedia o en Internet en general, encontrarán más información al respecto de cualquiera de ellas.</p>`;
	html += `<p>Y una nota que quiero añadir en el aspecto lingüístico, es que lo he hecho en castellano porque las entradas de Wikipedia dan más información que en otros idiomas, como es en catalán.</p>`;
	html += `<p>Idealmente, este libro tendría que estar hecho en inglés, pues es el idioma en el que más información proporciona Wikipedia sobre las especies, y es el lenguaje predominante de los papers científicos que encontramos en, por ejemplo, Google Scholar, donde encontraréis mucha más información técnica y de investigacioón de la mano de universidades de todo el mundo.</p>`;
	html += `<p>Mi intención era agregar los títulos e hipervínculos de todas las plantas de Google Scholar, pero lastimosamente, a Google Scholar no le parece bien que obtenga toda la información científica posible de "sus clientes" y para "proteger su privacidad" prefiere vetarme las visitas a su página web.</p>`;
	html += `<p>Hice lo que pude para facilitar el conocimiento del potencial de los seres vivos de su entorno floral.</p>`;
	html += `<p>Pero en este mundo, los gigantes se dedican a construir muros, no a romperlos.</p>`;
	html += `<p>Gracias.</p>`;
	html += `<br/>`;
	html += `<p>Y si echas en falta alguna especie que se encuentre de manera salvaje, te agradeceré que me envíes un correo a <a href="mailto:carlosjimenohernandez@gmail.com">carlosjimenohernandez@gmail.com</a>.</p>`;
	html += `</div>`;
	html += `${page_break}`;
	html += `<h1>Índice</h1>`;
	html += "<ul>";
	for(let indice=0; indice < indice_de_plantas.length; indice++) {
		const planta = indice_de_plantas[indice];
		html += `  <li class="enunciado"><a href="#${planta.replace(/ /g, "_")}">${indice+1}. ${planta}</a></li>`;
	}
	html += "</ul>";
	return html + html_base;
}

const tomar_estilos_de_entradas_wikipedia = function() {
	let styles = "";
	styles += `
<style>
html,body {
	padding: 0;
	margin: 0;
}
* {
	box-sizing: border-box;
}
.infobox {
  float: right;
  border: 1px solid #ccc;
  margin: 5px;
}
.entrada_de_planta_de_wikipedia {
  display: none;
  padding: 10px;
  position: relative;
  background-size: 100%;
  background-repeat: repeat-y;
  padding-top: 10px;
}
.fondo-clarito {
  background-color: rgba(255,255,255,0.4);
  text-shadow: 0 0 1px black;
  padding: 20px;
  text-align: center;
}
.entrada_de_planta_de_wikipedia.activada {
  display: block;
}
.mw-jump-link {
  display: none;
}
#texto_de_busqueda_de_plantas {
  padding: 10px;
  font-size: 15px;
  font-family: Roboto;
  display: block;
  width: 100%;
  box-sizing: border-box;
  border-radius: 0;
  border: 1px solid #E0E0E0;
  background-color: #F8F8F8;
}
li {
	list-style: none;
}
#lista_de_plantas_con_texto {
    padding: 10px;
    margin-top: 0;
}
#lista_de_plantas_con_texto > li {
	padding: 3px;
    font-size: 12px;
    border: 1px solid #E0E0E0;
    background-color: #E0E0E0;
    margin-top: 5px;
    margin-right: 5px;
    cursor: pointer;
    display: inline-block;
}
#lista_de_plantas_con_texto > li.activada {
    background-color: #CCC;
}
.imagen-de-planta-silvestre {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	width: 100%;
}
#numero_de_plantas_con_texto {
    padding: 10px;
    padding-bottom: 10px;
    margin: 0;
    font-size: 9px;
    padding-bottom: 0;
}
h1.titulo-de-pagina {
	padding: 20px;
	text-align: center;
}
.manual-autogenerado .fondo-clarito {
  background-color: white;
  text-shadow: 0 0 0px black;
  text-align: left;
  font-size: 11px;
}
</style>`;
	return styles;
}

const tomar_scripts_de_entradas_wikipedia = function() {
	let scripts = "";
	scripts += `
<script>
function buscar_texto_en_plantas(valor) {
	const valor_lower = valor.toLowerCase();
	const jEntradas = jQuery(".entrada_de_planta_de_wikipedia");
	const jLista = jQuery("#lista_de_plantas_con_texto");
	jEntradas.removeClass("activada");
	jLista.html("");
	if(valor === "") {
		jEntradas.removeClass("activada");
		jLista.find(".planta_con_texto").removeClass("activada");
		jQuery("#numero_de_plantas_con_texto").text("Recuerda: si echas en falta alguna planta, puedes enviarme un correo a carlosjimenohernandez@gmail.com");
		return jQuery();
	}
	let plantas_encontradas = 0;
	jEntradas.each(function() {
		const jEntrada = jQuery(this);
		const contiene_texto = jEntrada.text().toLowerCase().indexOf(valor_lower) !== -1;
		if(contiene_texto) {
			const id_de_planta = jEntrada.attr("id");
			const nombre_de_planta = id_de_planta.replace(/planta_de_nombre_/g, "");
			jItem = jQuery("<li class='planta_con_texto'>").text((plantas_encontradas + 1) + ". " + nombre_de_planta.substr(0,1).toUpperCase() + nombre_de_planta.substr(1).toLowerCase().replace(/_/g, " "));
			jItem.click(function() {
				jLista.find(".planta_con_texto").removeClass("activada");
				jEntradas.removeClass("activada");
				jEntrada.addClass("activada");
				jQuery(this).addClass("activada");
			});
			jItem.appendTo(jLista);
			plantas_encontradas++;
		}
	});
	jQuery("#numero_de_plantas_con_texto").text("Se encontraron " + plantas_encontradas + " coincidencias:");
}
</script>`;
	return scripts;
}

const tomar_script_de_jquery = function() {
	let script_jq = "";
	script_jq += `<script>`;
	script_jq += fs.readFileSync(__dirname + "/importaciones/jquery.min.js").toString();
	script_jq += `</script>`;
	return script_jq;
}

const generar_aplicacion = function(localidad, indice_de_plantas) {
	let app = "";
	app += `<!DOCTYPE html>\n`;
	app += `<html>\n`;
	app += `<head>\n`;
	app += `  <title>Plantas de ${localidad}</title>\n`;
	app += `  <meta charset="utf-8" />\n`;
	app += `  ${tomar_html_basico()}\n`;
	app += `  ${tomar_estilos_de_entradas_wikipedia()}\n`;
	app += `  ${tomar_scripts_de_entradas_wikipedia()}\n`;
	app += `  ${tomar_script_de_jquery()}\n`;
	app += `</head>\n`;
	app += `<body>\n`;
	app += `<h1 class="titulo-de-pagina">Guía interactiva de plantas de ${localidad}</h1>\n`;
	app += `  <input id="texto_de_busqueda_de_plantas" type="text" oninput="buscar_texto_en_plantas(this.value)" placeholder="Buscar texto aquí" autofocus value="" />\n`;
	app += `  <div id="numero_de_plantas_con_texto" /></div>\n`;
	app += `  <ul id="lista_de_plantas_con_texto" /></ul>\n`;
	for(let indice=0; indice < indice_de_plantas.length; indice++) {
		const planta = indice_de_plantas[indice];
		const ruta_a_wikipedia = `${ruta_a_localidades}/${localidad}/wikipedia/${planta.replace(/ /g, "-").toLowerCase()}.html`;
		const contenido_wikipedia = fs.readFileSync(ruta_a_wikipedia).toString();
		const $ = cheerio.load(contenido_wikipedia);
		$("img").remove();
		$("#mw-navigation").remove();
		$(".mw-editsection").remove();
		$(".thumb").remove();
		$("#footer-places,#footer-icons").remove();
		$(".mw-editsection").remove();
		app += `<div id="planta_de_nombre_${planta.replace(/ /g, "_").toLowerCase()}" class="entrada_de_planta_de_wikipedia" style="background-image: url('imagenes/${planta.replace(/ /g, "-").toLowerCase()}.jpg');">\n`;
		app += `<div class="fondo-clarito">\n`;
		app += `<hr />\n`;
		app += $("body").html()
			.replace(/ src=(\"|\')\//g, " src=$1https://es.wikipedia.org/")
			.replace(/ href=(\"|\')\//g, " href=$1https://es.wikipedia.org/")
			.replace(/width: ?[0-9] ?(px|rm|em|cm|%)/g, "");
		app += `</div>\n`;
		app += `</div>\n`;
	}
	app += `</body></html>`;
	return app;
}

const generar_libro_extensivo = function(localidad, indice_de_plantas) {
	let app = "";
	app += `<!DOCTYPE html>\n`;
	app += `<html>\n`;
	app += `<head>\n`;
	app += `  <title>Plantas de ${localidad}</title>\n`;
	app += `  <meta charset="utf-8" />\n`;
	app += `  ${tomar_html_basico()}\n`;
	app += `  ${tomar_estilos_de_entradas_wikipedia()}\n`;
	app += `  ${tomar_script_de_jquery()}\n`;
	app += `</head>\n`;
	app += `<body class="manual-autogenerado">\n`;
	app += `  <h1 class="titulo-de-pagina">Guía de Wikipedia de plantas de ${localidad}</h1>\n`;
	app += `  <ul id="lista_de_plantas_con_texto" /></ul>\n`;
	for(let indice=0; indice < indice_de_plantas.length; indice++) {
		const planta = indice_de_plantas[indice];
		const ruta_a_wikipedia = `${ruta_a_localidades}/${localidad}/wikipedia/${planta.replace(/ /g, "-").toLowerCase()}.html`;
		const contenido_wikipedia = fs.readFileSync(ruta_a_wikipedia).toString();
		const $ = cheerio.load(contenido_wikipedia);
		$("img").remove();
		$("#mw-navigation").remove();
		$(".mw-editsection").remove();
		$(".thumb").remove();
		$("#footer-places,#footer-icons").remove();
		$(".mw-editsection").remove();
		app += `${page_break}<div id="planta_de_nombre_${planta.replace(/ /g, "_").toLowerCase()}" class="entrada_de_planta_de_wikipedia_">\n`;
		app += `<div class="fondo-clarito" style="text-align: left !important;">\n`;
		app += `<hr />\n`;
		app += $("body").html()
			.replace("</h1>", `</h1>\n<img class="imagen-planta" src="imagenes/${planta.replace(/ /g, "-").toLowerCase()}.jpg" />\n${page_break}`)
			.replace(/ src=(\"|\')\//g, " src=$1https://es.wikipedia.org/")
			.replace(/ href=(\"|\')\//g, " href=$1https://es.wikipedia.org/")
			.replace(/width: ?[0-9] ?(px|rm|em|cm|%)/g, "");
		app += `</div>\n`;
		app += `</div>\n`;
	}
	app += `</body></html>`;
	return app;
}

const execution = async function() {
	try {
		const localidades = fs.readdirSync(ruta_a_localidades);
		const plantas_reducer = (out, item) => {
			const item_limpio = item.replace(/(\-\-[0-9]+)?\.(jpg|png|jpeg|webp)$/g, "");
			if(!(item_limpio in out)) {
				out[item_limpio] = [];
			}
			out[item_limpio].push(item);
			return out;
		};
		for(let index_localidad=0; index_localidad < localidades.length; index_localidad++) {
			console.log("[*] Localidad " + (index_localidad + 1) + " de " + localidades.length);
			const localidad = localidades[index_localidad];
			let html = "";
			const ruta_a_localidad = ruta_a_localidades + "/" + localidad;
			const plantas_de_localidad_en_bruto = fs.readdirSync(ruta_a_localidad + "/imagenes");
			const plantas_de_localidad = plantas_de_localidad_en_bruto.reduce(plantas_reducer, {});
			let index_planta = 0;
			const total_plantas = Object.keys(plantas_de_localidad).length;
			const indice_de_plantas = [];
			PlantasPorLocalidad:
			for(let planta_de_localidad in plantas_de_localidad) {
				const planta = nombre_bonito_de_planta(planta_de_localidad);
				indice_de_plantas.push(planta);
				index_planta++;
				/*
				if(index_planta > 1) {
					break PlantasPorLocalidad;
				}
				//*/
				console.log("[*] Incorporando planta " + index_planta + " de " + total_plantas + " (" + planta + ")");
				console.log("[*] Descargando información de Wikipedia de " + planta + "...");
				const pagina = await descargar_pagina_de_planta_de_wikipedia(localidad, planta_de_localidad);
				const taxonomia = await descargar_taxonomia_de_planta_de_wikipedia(pagina);
				const palabras_destacables = extraer_palabras_destacables_de_wikipedia(pagina);
				const referencias = extraer_referencias_de_wikipedia(pagina, planta);
				const nombres_populares = extraer_nombres_populares(pagina, planta);
				const fotos_de_planta = plantas_de_localidad[planta_de_localidad];
				html += `${page_break}<h1 id="${planta.replace(/ /g, "_")}">${planta}</h1>`;
				for(let index_foto=0; index_foto < fotos_de_planta.length; index_foto++) {
					const foto_de_planta = fotos_de_planta[index_foto];
					html += `<div class="centrado"><img class="imagen-planta" src="imagenes/${foto_de_planta}" /></div>`;
					const ruta_de_foto = ruta_a_localidades + "/" + localidad + "/imagenes/" + foto_de_planta;
					try {
						cp.execSync(`convert ${JSON.stringify(ruta_de_foto)} -resize 600 ${JSON.stringify(ruta_de_foto)}`);
					} catch(error) {
						
					}
				}
				html += `${page_break}<div style="margin-top: 20px; font-size: 12px; font-weight:bold; text-decoration:underline; padding-bottom: 10px;">Datos de ${planta}:</div>`;
				if(taxonomia) {
					html += "<div class='enunciado'>Taxonomía:</div>";
					html += "<ul class='info-planta'>";
					for(let tipo_taxon in taxonomia) {
						html += "<li>";
						html += `  <b>${nombre_bonito_de_planta(tipo_taxon)}:</b> ${taxonomia[tipo_taxon]}`;
						html += "</li>";
					}
					html += "</ul>";
				} else {
					html += "<p class='enunciado'>Lo siento. Hubo problemas para documentar esta especie.</p>";
				}
				if(nombres_populares.length && !(nombres_populares[0] === '')) {
					html += "<div class='enunciado'>Nombres populares según wikipedia.es:</div>";
					html += "<ul class='info-destacable-planta'><li>";
					for(let index=0; index < nombres_populares.length; index++) {
						const palabra = nombres_populares[index];
						if(index === 0) {
							html += "<span>" + palabra + "</span>";
						} else if(index === (nombres_populares.length-1)) {
							html += " y <span>" + palabra + "</span>";
						} else {
							html += ", <span>" + palabra + "</span>";
						}
					}
					html += "</li></ul>";
				} else {
					html += "<div class='enunciado'>No se encontraron nombres populares para esta planta desde Wikipedia</div><br/>"
				}
				if (palabras_destacables) {
					html += "<div class='enunciado'>Palabras destacables en wikipedia.es:</div>";
					html += "<ul class='info-destacable-planta'><li>";
					for (let index = 0; index < palabras_destacables.length; index++) {
						const palabra = palabras_destacables[index];
						if (index === 0) {
							html += "<span>" + palabra + "</span>";
						} else if (index === (palabras_destacables.length - 1)) {
							html += " y <span>" + palabra + "</span>";
						} else {
							html += ", <span>" + palabra + "</span>";
						}
					}
					html += "</li></ul>";
				}
				if (referencias) {
					html += "<div class='enunciado'>Referencias en wikipedia.es:</div>";
					html += referencias;
				}
			}
			html = generar_libro(html, localidad, indice_de_plantas);
			fs.writeFileSync(ruta_a_localidad + "/LIBRO.html", html, "utf8");
			console.log("[*] Creando formato PDF de plantas de " + localidad + "...");
			//*
			await new Promise(function(ok, fail) {
				const contenido_html = fs.readFileSync(ruta_a_localidad + "/LIBRO.html").toString();
				htmlPdf.create(contenido_html, {
					format: "A4",
					base: "file:///" + ruta_a_localidad + "/",
					timeout: 300 * 1000,
				}).toFile(ruta_a_localidad + "/LIBRO-v1.pdf", function(error) {
					if(error) {
						return fail(error);
					}
					return ok();
				});
			});
			//*/
			console.log("[*] Creando aplicación HTML de plantas de " + localidad + "...");
			const app = generar_aplicacion(localidad, indice_de_plantas);
			fs.writeFileSync(ruta_a_localidad + "/APLICACION.html", app, "utf8");
			////////////////////////
			const app2 = generar_libro_extensivo(localidad, indice_de_plantas);
			fs.writeFileSync(ruta_a_localidad + "/MANUAL.html", app2, "utf8");
			console.log("[*] Creando formato PDF de manual de plantas de " + localidad + "...");
			await new Promise(function(ok, fail) {
				const contenido_html = fs.readFileSync(ruta_a_localidad + "/MANUAL.html").toString();
				htmlPdf.create(contenido_html, {
					format: "A4",
					base: "file:///" + ruta_a_localidad + "/",
					timeout: 300 * 1000,
				}).toFile(ruta_a_localidad + "/MANUAL-v1.pdf", function(error) {
					if(error) {
						return fail(error);
					}
					return ok();
				});
			});
		}
		console.log("[*] El proceso terminó con éxito.");
	} catch(error) {
		throw error;
	}
};

execution();
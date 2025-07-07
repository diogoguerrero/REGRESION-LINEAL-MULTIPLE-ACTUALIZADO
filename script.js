const form = document.getElementById("calc-form");
const variableSelect = document.getElementById("variable");
const resultadoDiv = document.getElementById("resultado");
const interpretacionDiv = document.getElementById("interpretacion");
const historialBody = document.querySelector("#historial tbody");

const inputs = {
  Y: document.getElementById("Y"),
  longitud: document.getElementById("longitud"),
  masa: document.getElementById("masa"),
  mantenimiento: document.getElementById("mantenimiento")
};

const coef = {
  a: 12.8877,
  b: 0.0004744,
  c: -0.0003125,
  d: -0.0036265
};

let chart;

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const selected = variableSelect.value;

  let longitud = parseFloat(inputs.longitud.value);
  let masa = parseFloat(inputs.masa.value);
  let mantenimiento = parseFloat(inputs.mantenimiento.value);
  let Y = parseFloat(inputs.Y.value);

  let resultado;

  switch (selected) {
    case "Y":
      resultado = coef.a + coef.b * longitud + coef.c * masa + coef.d * mantenimiento;
      inputs.Y.value = resultado.toFixed(3);
      break;
    case "longitud":
      resultado = (Y - coef.a - coef.c * masa - coef.d * mantenimiento) / coef.b;
      inputs.longitud.value = resultado.toFixed(3);
      break;
    case "masa":
      resultado = (Y - coef.a - coef.b * longitud - coef.d * mantenimiento) / coef.c;
      inputs.masa.value = resultado.toFixed(3);
      break;
    case "mantenimiento":
      resultado = (Y - coef.a - coef.b * longitud - coef.c * masa) / coef.d;
      inputs.mantenimiento.value = resultado.toFixed(3);
      break;
  }

  resultadoDiv.textContent = `Resultado (${selected.toUpperCase()}): ${resultado.toFixed(3)}`;
  interpretar(selected, resultado);
  actualizarGrafico();
  agregarAHistorial(inputs.longitud.value, inputs.masa.value, inputs.mantenimiento.value, inputs.Y.value);
});

function interpretar(variable, valor) {
  let mensaje = "";

  switch (variable) {
    case "Y":
      if (valor < 5) mensaje = "El desplazamiento es mínimo, lo cual es positivo.";
      else if (valor < 15) mensaje = "El desplazamiento es moderado.";
      else mensaje = "El desplazamiento es alto, revise condiciones.";
      break;
    case "longitud":
      mensaje = `El puente tendría una longitud aproximada de ${valor.toFixed(2)} m.`;
      break;
    case "masa":
      mensaje = `La masa por metro lineal necesaria sería de ${valor.toFixed(2)} kg/m.`;
      break;
    case "mantenimiento":
      mensaje = `El mantenimiento estimado necesario es de ${valor.toFixed(2)}%.`;
      break;
  }

  interpretacionDiv.textContent = mensaje;
}

function actualizarGrafico() {
  const labels = ["Longitud", "Masa", "Mantenimiento"];
  const data = [
    parseFloat(inputs.longitud.value),
    parseFloat(inputs.masa.value),
    parseFloat(inputs.mantenimiento.value)
  ];

  const ctx = document.getElementById("grafico").getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Valores de entrada",
        data: data,
        backgroundColor: ["#007bff", "#28a745", "#ffc107"]
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function agregarAHistorial(longitud, masa, mantenimiento, Y) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${parseFloat(longitud).toFixed(2)}</td>
    <td>${parseFloat(masa).toFixed(2)}</td>
    <td>${parseFloat(mantenimiento).toFixed(2)}</td>
    <td>${parseFloat(Y).toFixed(2)}</td>
  `;
  historialBody.appendChild(row);
}

document.getElementById("descargar").addEventListener("click", function () {
  let csv = "Longitud,Masa,Mantenimiento,Desplazamiento\n";
  document.querySelectorAll("#historial tbody tr").forEach(row => {
    csv += Array.from(row.children).map(cell => cell.textContent).join(",") + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "historial_puente.csv";
  link.click();
});
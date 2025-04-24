document.getElementById('btn-subir').addEventListener('click', () => {
    const archivo = document.getElementById('archivo').files[0];
    if (!archivo) return alert("¡Sube un archivo primero!");

    const reader = new FileReader();
    reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const primeraHoja = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(primeraHoja);

        document.getElementById('resumen').innerHTML = `
            <h3>Resumen del Cronograma</h3>
            <p>Total actividades: <strong>${jsonData.length}</strong></p>
            <h5 class="mt-3">Primeras 3 actividades:</h5>
            <pre>${JSON.stringify(jsonData.slice(0, 3), null, 2)}</pre>
        `;
    };
    reader.readAsArrayBuffer(archivo);
});
// Añade después de leer el Excel (en el evento reader.onload)
const ctx = document.createElement('canvas');
ctx.id = 'ganttChart';
document.getElementById('resumen').appendChild(ctx);

new Chart(ctx, {
    type: 'bar',
    data: {
        labels: jsonData.slice(0, 10).map(item => item.Actividad), // Muestra solo 10 actividades
        datasets: [{
            label: 'Duración (días)',
            data: jsonData.slice(0, 10).map(item => parseInt(item["Duración programada"].split(' ')[0])),
            backgroundColor: '#005a87'
        }]
    },
    options: {
        indexAxis: 'y',
        scales: {
            x: { beginAtZero: true }
        }
    }
});

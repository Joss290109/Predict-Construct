document.getElementById('btn-subir').addEventListener('click', () => {
    const archivo = document.getElementById('archivo').files[0];
    if (!archivo) return alert("¡Sube un archivo primero!");

    const reader = new FileReader();
    reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const primeraHoja = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(primeraHoja);

        // Resumen
        document.getElementById('resumen').innerHTML = `
            <h3>Resumen del Cronograma</h3>
            <p>Total actividades: <strong>${jsonData.length}</strong></p>
        `;

        // Gantt
        const ctx = document.createElement('canvas');
        ctx.id = 'ganttChart';
        document.getElementById('resumen').appendChild(ctx);
        new Chart(ctx, {
            type: 'bar',
            data: { /* ...código del Gantt... */ }
        });

        // Desviaciones
        const desviaciones = analizarDesviaciones(jsonData);
        if (desviaciones.length > 0) {
            const alerta = document.createElement('div');
            alerta.className = 'alerta-roja mt-3';
            alerta.innerHTML = `<strong>⚠️ ${desviaciones.length} actividades con problemas:</strong><br>${
                desviaciones.map(d => `${d.Actividad}: ${d.Problema}`).join('<br>')
            }`;
            document.getElementById('resumen').appendChild(alerta);
        }
    };
    reader.readAsArrayBuffer(archivo);
});

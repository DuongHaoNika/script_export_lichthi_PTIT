function addExportButton() {
    const buttons = document.getElementsByClassName("d-inline-block col-lg-3 col-md-12 col-sm-12 mb-1 text-center text-nowrap");
    const firstButtonContainer = buttons[0]; 
    const button = document.createElement("button"); 
    button.innerText = "Xuất lịch thi";
    button.className = "btn btn-outline-primary btnprintxem";
    button.style.marginLeft = "8px";
    firstButtonContainer.appendChild(button);
}


function exportToCalendar() {
    const table = document.getElementById("excel-table");
    if (!table) {
        console.error("Không tìm thấy bảng với ID 'excel-table'");
        return;
    }

    const rows = table.querySelectorAll("tr");
    let events = [];

    for(let i = 2; i < rows.length; i++) {
        const cells = rows[i].querySelectorAll("td");
        if (cells.length > 0 && cells[2] != "undefined") {
            const subject = cells[2].innerText.trim(); 
            const date = cells[4].innerText.trim();
            const time = cells[5].innerText.trim(); 
            const duration = parseInt(cells[6].innerText.trim());
            const grade = cells[7].innerText.trim();

            const [day, month, year] = date.split("/");
            const [hours, minutes] = time.split(":");
            const startDate = new Date(year, month - 1, day, hours, minutes);

            const endDate = new Date(startDate.getTime() + duration * 60000);

            const event = `BEGIN:VEVENT\nSUMMARY:${subject}\nDTSTART:${formatDateToICS(startDate)}\nDTEND:${formatDateToICS(endDate)}\nDESCRIPTION:Lịch thi môn ${subject}\nLOCATION:${grade}\nEND:VEVENT`;
                events.push(event);
            }
        }

    const calendarData = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//qldt//lichthi//EN\n${events.join("\n")}\nEND:VCALENDAR`;

    const blob = new Blob([calendarData], { type: "text/calendar" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "lich-thi.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function formatDateToICS(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = "00";
    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

addExportButton();
exportToCalendar();
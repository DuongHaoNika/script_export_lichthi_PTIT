// ==UserScript==
// @name         Xuất lịch thi (.ics)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Xuất lịch thi ra file .ics để import lên Google Calendar
// @author       Duong Quang Hao
// @match        https://qldt.ptit.edu.vn/*
// @include      *
// @run-at       document-start
// ==/UserScript==


(function () {
    "use strict";

    console.log("Duong Quang Hao");
    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function main() {
        function formatDateToICS(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            const seconds = "00";
            return `${year}${month}${day}T${hours}${minutes}${seconds}`;
        }

        let buttons;
        await sleep(3000);

        buttons = document.getElementsByClassName("d-inline-block col-lg-3 col-md-12 col-sm-12 mb-1 text-center text-nowrap");
        console.log("Length: " + buttons.length);
        const button = document.createElement("button");
        button.innerText = "Export";
        button.className = "btn btn-outline-primary btnprintxem";
        button.style.marginRight = "8px";
        console.log("BTN: " + buttons[0])
        buttons[0].insertBefore(button, buttons[0].firstChild);

        button.addEventListener("click", async function () {
            const table = document.getElementById("excel-table");
            const rows = table.querySelectorAll("tr");
            let events = [];

            for (let i = 2; i < rows.length; i++) {
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
        });
    }

    main();

})();

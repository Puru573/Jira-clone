let add = document.querySelector(".add");
let ticketContainer = document.querySelector(".ticket-container");
let ticketdiv = document.querySelector(".ticketdiv");
let rootdiv = document.querySelector(".modal-root");
let navColor=document.querySelector(".color-container");
let reseBtn=document.querySelector(".resetbtn");
let closeBtn=document.querySelector(".closebtn");
let textAreaValue;
let selectedColor;
let navSelectedColor;
let allTickets=[];
let classesList = ["blue-color-box", "red-color-box", "orange-color-box", "black-color-box"];
let count=0;
let finalColor;
let totalTickets=[];
let savedTickets=[];
let uuid = Math.ceil((Math.random() + 1) * 100);



// Show modal to write text and select color
add.addEventListener("click", (e) => {
    let textArea = document.querySelector("textarea");
    let modalColor=document.querySelector(".modal-color");
    if (textArea && modalColor) {
        rootdiv.removeChild(textArea);
        rootdiv.removeChild(modalColor);
    } else {
        let div = document.createElement("textarea");
        div.setAttribute("type", "text"); // modal div
        div.setAttribute("placeholder", "write a text...");
        // color container
        let seconddiv = document.createElement("div");

        seconddiv.setAttribute("class", "modal-color");
        classesList.forEach((color) => {
            let colorClass = document.createElement("div");
            colorClass.classList.add(color);
            seconddiv.appendChild(colorClass);
        });
        rootdiv.appendChild(div);
        rootdiv.appendChild(seconddiv);
    }
});

// coloring the ticket based on the modal color-palatte selection
rootdiv.addEventListener("click", (e) => {
    // Check if the clicked element has one of the color-box classes
    if (
      e.target.classList.contains("blue-color-box") ||
      e.target.classList.contains("red-color-box") ||
      e.target.classList.contains("orange-color-box") ||
      e.target.classList.contains("black-color-box")
    ) {
      const parent = e.target.parentElement;
      parent.querySelectorAll("div").forEach((box) => {
        box.classList.remove("active");
      });
        e.target.classList.add("active");
        let colors = e.target.className; // e.g. "blue-color-box"
      selectedColor = colors.split("-")[0]; // => "blue"
    }
  });
  


// Create tickets when Shift key is pressed
document.addEventListener("keydown", (e) => {
    if (e.key === "Shift") {
        let textarea = document.querySelector("textarea");
        textAreaValue = textarea.value;

        // Remove modal
        let textArea = document.querySelector("textarea");
        let modalColor=document.querySelector(".modal-color");
        if (textArea && modalColor) {
            rootdiv.removeChild(textArea);
            rootdiv.removeChild(modalColor);
        }

        // Create the new ticket div
        let divTickets = document.createElement("div");
        let editTicketDiv=document.createElement("div");
        let ticketstrap=document.createElement("div");
        ticketstrap.setAttribute("class","ticket-strap");
        ticketstrap.setAttribute("contenteditable","false");
        editTicketDiv.setAttribute("class","editTicket");
        editTicketDiv.setAttribute("contenteditable", "false");
        editTicketDiv.innerHTML += textAreaValue; // Append the text content
        ticketstrap.innerText=uuid;
        // ticketstrap.innerHTML+=ti
        divTickets.setAttribute("class", "tickets");
        divTickets.setAttribute("id", uuid);
        let lockBtn = document.createElement("span");
        lockBtn.classList.add("material-icons", "lockbtn");
        lockBtn.setAttribute("data-set", "true");
        lockBtn.innerText = "lock";
        if(selectedColor){
            ticketstrap.style.backgroundColor=selectedColor;
        }
        else{
            ticketstrap.style.backgroundColor="black";
        }
        ticketstrap.style.color="white";
        divTickets.appendChild(ticketstrap);

        divTickets.appendChild(lockBtn);

        divTickets.appendChild(editTicketDiv);
        ticketdiv.appendChild(divTickets);
        savedTickets.push({
            id:uuid,
            value:textAreaValue,
            selectedColor: selectedColor || "black"
        })

        localStorage.setItem("tickets",JSON.stringify(savedTickets));
        // Initially make the ticket non-editable

    }
});

function updateLocalStorage(){
    localStorage.setItem("tickets", JSON.stringify(savedTickets));

}
function handleInput(e) {
    // Identify which ticket was edited by looking at its closest .tickets parent
    let ticketDiv = e.target.closest(".tickets");
    let ticketId = Number(ticketDiv.id);  // Convert ID string to a number (if needed)
    let updatedValue = e.target.innerText;
  
    // Find the ticket in your savedTickets array and update it
    let ticketIndex = savedTickets.findIndex((t) => t.id === ticketId);
    if (ticketIndex !== -1) {
      savedTickets[ticketIndex].value = updatedValue;
      updateLocalStorage();
    }
  }
        // Attach the click event listener to toggle lock state after ticket creation

ticketdiv.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("lockbtn")) {
        let lockBtn = e.target;
        console.log("lockbtnn",lockBtn);
        let divTickets = lockBtn.parentElement; // The parent ticket div  coz we can change the contentediable
        let editTicket = divTickets.querySelector(".editTicket");

        let locbtnvalue = lockBtn.getAttribute("data-set");
        if (locbtnvalue === "true") {
            lockBtn.innerText = "lock_open"; // Change to unlock icon
            lockBtn.setAttribute("data-set", "false"); // Mark as unlocked
            // Make the ticket editable when unlocked
            editTicket.setAttribute("contenteditable", "true");
            editTicket.addEventListener("input", handleInput);  //type hoga tbhi jayega immediate invoke se bachayega

        } else {
            lockBtn.innerText = "lock"; // Change back to lock icon
            lockBtn.setAttribute("data-set", "true"); // Mark as locked
            // Make the ticket non-editable when locked
            editTicket.setAttribute("contenteditable", "false");
            editTicket.removeEventListener("input", handleInput);

        }
    }
});

navColor.addEventListener("click",(e)=>{
    if(e.target){
        let colors=e.target.className.split("-")[0];
        navSelectedColor=colors;
    }
    filteredTickets();
})

// filter the ticketws on the basis of color

const filteredTickets=(()=>{
    let tickets=document.querySelectorAll(".tickets");
    allTickets=[];
    tickets.forEach((ticket)=>{
        ticket.style.display="none";
        allTickets.push(ticket);
    })
    let filteredTicket=allTickets.filter((ticket)=>{
        let ticketStrapColor=ticket.querySelector(".ticket-strap");
        if(ticketStrapColor.style.backgroundColor === navSelectedColor){
            return ticket;
        }
    })
    filteredTicket.forEach((ticket)=>{
        ticket.style.display="block";
    })
})

// changing the color of the tickcet on per click
document.addEventListener("click",(e)=>{
    let tickets=document.querySelectorAll(".tickets");
    totalTickets=[];
    if(e.target.classList.contains("resetbtn")){
        tickets.forEach((ticket)=>{
            ticket.style.display="block";
        })
    }
    else if(e.target.classList.contains("ticket-strap")){
        let ticketStrap=e.target;
        if(ticketStrap){
            count++;
            if(count>=classesList.length){
                count=0;
            }
                finalColor=classesList[count].split("-")[0];
                ticketStrap.style.backgroundColor=finalColor;
        }
    }
    else if(e.target.classList.contains("editTicket")){
        let latestTicket=e.target.parentElement;
        let removedId;
        tickets.forEach((ticket)=>{
            totalTickets.push(ticket);
        })
        if(closeBtn.classList.contains("active")){
            let selectedTickets=latestTicket.id;
            totalTickets.forEach((item)=>{
                if(item.id===selectedTickets){
                    removedId=item.id;
                    item.remove();
                }
            })
            let filteredTickets = savedTickets.filter((item) => String(item.id) != String(removedId));
            savedTickets=filteredTickets; //updation is necessary
            localStorage.setItem("tickets", JSON.stringify(savedTickets));
        }
    }
})

// deleting the ticket
closeBtn.addEventListener("click",()=>{
    closeBtn.classList.toggle("active");
})

document.addEventListener("DOMContentLoaded",()=>{
    let stored = localStorage.getItem("tickets");
    let ticketshtml = stored ? JSON.parse(stored) : [];

    // Keep them in our global array
    if(ticketshtml){
        ticketshtml.forEach((item)=>{
            let allSavedTickets=`
            <div class="tickets" id="${item.id}">
            <div class="ticket-strap" contenteditable="false" style="background-color: ${item.selectedColor?item.selectedColor:"black"}; color: white;">${item.id}</div>
            <span class="material-icons lockbtn" data-set="true">lock</span>
            <div class="editTicket" contenteditable="false">${item.value}</div>
            </div>
            `;
            ticketdiv.innerHTML+=allSavedTickets;
        })
    }
})

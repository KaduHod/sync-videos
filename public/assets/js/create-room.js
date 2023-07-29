const form = document.forms['create-room'];
const roomNameInput = form.elements['room-name'];
const createRoomButton = form.elements['send'];

createRoomButton.addEventListener('click', (event) => {
    if(!roomNameInput.value.trim()) {
        alert("Escolha um nome para a sala antes de criar");
    }
})
// variables agregar
const titleNew = $('#title-new');
const dateNew = $('#date-new');
const dateEndNew = $('#date-end-new');
const descriptionNew = $('#description-new');
const stateNew = $('#state-event-new');
// variables editar
const titleEdit = $('#title-edit');
const dateEdit = $('#date-edit');
const dateEndEdit = $('#date-end-edit');
const descriptionEdit = $('#description-edit');
const stateEdit = $('#state-event-edit');

let newEvent;
let idSelect = '';
// Firebase
// Initialize Firebase
var config = {
  apiKey: "AIzaSyBgNUYGo0wMSBegfA0gnWULpVIVmQowRug",
  authDomain: "fir-b0664.firebaseapp.com",
  databaseURL: "https://fir-b0664.firebaseio.com",
  projectId: "fir-b0664",
  storageBucket: "fir-b0664.appspot.com",
  messagingSenderId: "17497757455"
};
firebase.initializeApp(config);
let database = firebase.database();
let eventsData = database.ref('eventos');
eventsData.on('value', function (datos) {
  $('#calendar').fullCalendar({
    defaultView: 'month',

    events: datos.val(),
    timezone: 'America/Lima',
    // seleccionando el evento
    eventClick: function (callEvent, jsEvent, view) {
      let fullDay = '';

      if (callEvent.end === null) {
        fullDay = callEvent.start._i
      } else {
        fullDay = callEvent.end._i
      }
      $('#modal-events').modal();
      $('#titleEvent').text(`${callEvent.title}`);
      titleEdit.val(`${callEvent.title}`);
      dateEdit.val(`${callEvent.start._i}`);
      dateEndEdit.val(`${fullDay.substr(0,10)}`);
      descriptionEdit.val(`${callEvent.descripcion}`);
      stateEdit.val(`${callEvent.state}`);
      localStorage.idSelect = `${callEvent.id}`


    },
    // seleccionando el día para un nuevo evento
    dayClick: function (date, jsEvent, view) {
      console.log(date)
      dateNew.val(date.format()); // seleccionar fecha
      dateEndNew.val(date.format());
      $('#modal-day').modal(); // abrir modal
    }
  });
});



// Obteniendo el último evento
let lastEvent = '';

eventsData.on('value', function (datos) {
  lastEvent = datos.val().length;
  localStorage.lastEvent = lastEvent; // guardando 
})

// obteniendo el valor id siguiente
let id = parseInt(localStorage.getItem('lastEvent'));
let eventsDataNew = database.ref('eventos/' + id);;

$('#btn-add').on('click', function () {

  //clearForm(); // limpiando input
  eventsDataNew.set({
    title: titleNew.val(),
    start: dateNew.val(),
    end: dateEndNew.val() +' 24:00:00',
    descripcion: descriptionNew.val(),
    state: localStorage.stateNew,
    id: id,
    color: stateColor(localStorage.stateNew)

  }, function () {
    console.log('Se registro correctamente');
    $('#calendar').fullCalendar('renderEvent', {
      title: titleNew.val(),
      start: dateNew.val(),
      end: dateEndNew.val() +' 24:00:00',
      descripcion: descriptionNew.val(),
      state: localStorage.stateNew,
      id: id,
      color: stateColor(localStorage.stateNew)
    });
    clearForm();
  });

  $('#modal-day').modal('toggle');

});

// Actualizar evento
$('#update').on('click', function () {
  let idUpdate = localStorage.getItem('idSelect')
  var eventUpdate = firebase.database().ref(`eventos/${idUpdate}`);
  eventUpdate.update({
    title: titleEdit.val(),
    start: dateEdit.val(),
    end: dateEndEdit.val() +' 24:00:00',
    descripcion: descriptionEdit.val(),
    state: localStorage.stateEdit,
    color: stateColor(localStorage.stateEdit)

  });
  $('#calendar').fullCalendar('refetchEvents');


  $(location).attr('href', 'index.html'); // recargar la pagina
  $('#modal-events').modal('toggle');
});



// Seleccionando valor de estado por valor 1 :orden de compra  2:cotización
stateNew.on('change', function () {
  let statenew = stateNew.val();
  localStorage.stateNew = statenew;

})

stateEdit.on('change', function () {
  let stateUpdate = stateEdit.val();
  localStorage.stateEdit = stateUpdate;

})



//Limpiar formulario
function clearForm() {
  titleNew.val('');
  dateNew.val('');
  dateEndNew.val('');
  descriptionNew.val('');
  stateNew.val('0');
}

// estados por colores
function stateColor(state) {
  if (state == 1) {
    return 'red'
  }
  if (state == 2) {
    return 'yellow'
  }
}
const statusBadges = document.querySelectorAll('span.rounded-pill')
const lastStatusBadge = statusBadges[statusBadges.length-1]

if(lastStatusBadge.innerHTML === 'IN'){
  lastStatusBadge.classList.add('bg-warning')
  lastStatusBadge.classList.remove('bg-success') 
}


const selectViewCheckboxes = document.querySelectorAll('.select-view-by .form-check-input')

for(let selectViewCheckbox of selectViewCheckboxes){
  selectViewCheckbox.addEventListener('click',function(e){
      
      if(this.value==="day"){
        const datePicker = document.querySelector('#datepicker')
        const monthPicker = document.querySelector('#monthpicker')
        const yearPicker = document.querySelector('#yearpicker')
        datePicker.disabled= false
        datePicker.classList.add('bg-white')

        monthPicker.disabled = true
        monthPicker.classList.remove('bg-white')
        monthPicker.value=''
        yearPicker.disabled = true
        yearPicker.classList.remove('bg-white')
        yearPicker.value=''

      }
      else if(this.value==="month"){
        const datePicker = document.querySelector('#datepicker')
        const monthPicker = document.querySelector('#monthpicker')
        const yearPicker = document.querySelector('#yearpicker')
        datePicker.disabled = true
        datePicker.classList.remove('bg-white')
        datePicker.value=''
        monthPicker.disabled = false
        monthPicker.classList.add('bg-white')
        yearPicker.disabled = true
        yearPicker.classList.remove('bg-white')
        yearPicker.value=''


      }
      else{
        const datePicker = document.querySelector('#datepicker')
        const monthPicker = document.querySelector('#monthpicker')
        const yearPicker = document.querySelector('#yearpicker')
        datePicker.disabled = true
        datePicker.classList.remove('bg-white')
        datePicker.value=''

        monthPicker.disabled = true
        monthPicker.classList.remove('bg-white')
        monthPicker.value=''

        yearPicker.disabled = false
        yearPicker.classList.add('bg-white')

      }
  })
}



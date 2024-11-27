let popup=document.getElementById("popup");
let addbtn=document.getElementById("add-btn");
let overlay=document.getElementById("overlay");
let create=document.getElementById("create");
let cancel=document.getElementById("cancel")

document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu');

  menuToggle.addEventListener('click', function() {
      menu.classList.toggle('hidden');
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
      const isClickInsideMenu = menu.contains(event.target);
      const isClickOnMenuToggle = menuToggle.contains(event.target);

      if (!isClickInsideMenu && !isClickOnMenuToggle && !menu.classList.contains('hidden')) {
          menu.classList.add('hidden');
      }
  });

  // Ensure menu is visible on larger screens
  window.addEventListener('resize', function() {
      if (window.innerWidth >= 1024) { // lg breakpoint
          menu.classList.remove('hidden');
      } else {
          menu.classList.add('hidden');
      }
  });
});

addbtn.addEventListener('click',function(){
  popup.className=('center h-full w-full top-0 left-0 z-0 items-center justify-center flex')
  overlay.className=('overlay absolute h-full w-full bg-black opacity-85 top-0 left-0 z-10 flex')
})
create.addEventListener('click',function(){
  popup.className=('center h-full w-full top-0 left-0 z-0 items-center justify-center flex')
  overlay.className=('overlay absolute h-full w-full bg-black opacity-85 top-0 left-0 z-10 flex')
})
cancel.addEventListener("click",function(){
  popup.className=('hidden')
  overlay.className=('hidden')
})

// list box
// Filter Buttons
const filterButtons = document.querySelectorAll('.filter-btn'); // Add class "filter-btn" to your buttons (All, Income, Expense)
filterButtons.forEach(button => {
    button.addEventListener('click', function () {
        const filterType = this.getAttribute('data-type'); // Get the type of filter from the button's data attribute
        filterList(filterType);
    });
});
// Filter Function
function filterList(filterType) {
  const listItems = document.querySelectorAll('.listbox'); // Select all list items
  listItems.forEach(item => {
      const type = item.getAttribute('data-type'); // Get the data-type attribute of the list item
      if (filterType === 'all' || filterType === type) {
          item.style.display = 'flex'; // Show the item
      } else {
          item.style.display = 'none'; // Hide the item
      }
  });
}
// Updated Submit Event Listener to Add Filter Type
submit.addEventListener('click', function () {
  // Select the root container
  let root = document.querySelector('.root');
  
  popup.className=('hidden')
  overlay.className=('hidden')
  // Create a new listbox
  let list = document.createElement('div');
  list.className = 'listbox bg-black h-fit w-64 rounded-lg flex flex-col gap-3 z-0';
  
  // Add a data-type attribute to the listbox for filtering
  let type = document.querySelector('input[name="type"]:checked').value;
  list.setAttribute('data-type', type); // Set "income" or "expence"
  root.appendChild(list);

  // Add title
  let title = document.createElement('h1');
  title.className = 'p-3 text-blue-600 font-bold';
  let title1 = document.getElementById('title').value;
  title.innerText = title1;
  list.appendChild(title);

  // Add amount
  let amount = document.createElement('h1');
  amount.className = 'p-3 text-blue-600 font-bold';
  let amount1 = document.getElementById('amount').value;
  amount.innerText = amount1;
  list.appendChild(amount);

  // Add description
  let description = document.createElement('p');
  description.className = 'p-3 text-white';
  let description1 = document.getElementById('discription').value;
  description.innerText = description1;
  list.appendChild(description);

  // Add buttons container
  let buttons = document.createElement('div');
  buttons.className = 'buttons1 flex gap-3 p-3 pb-2 justify-end';
  list.appendChild(buttons);

  // Add Edit button
  let edit = document.createElement('button');
  edit.className = 'bg-blue-600 text-white rounded-lg p-1 hover:bg-blue-950 w-20';
  edit.innerText = 'Edit';
  buttons.appendChild(edit);

  // Add Delete button
  let delete1 = document.createElement('button');
  delete1.className = 'bg-blue-600 text-white rounded-lg p-1 hover:bg-red-700 w-20';
  delete1.innerText = 'Delete';
  buttons.appendChild(delete1);


    // Store the current values in an object (to use for editing later)
    const currentData = {
        title: title1,
        amount: amount1,
        description: description1
    };

    // Handle Edit button click
    edit.addEventListener('click', function () {
        // Populate input fields with the current list item values
        
          popup.className=('center h-full w-full top-0 left-0 z-0 items-center justify-center flex')
          overlay.className=('overlay absolute h-full w-full bg-black opacity-85 top-0 left-0 z-10 flex')
        
        document.getElementById('title').value = currentData.title;
        document.getElementById('amount').value = currentData.amount;
        document.getElementById('discription').value = currentData.description;
        
        // Optionally, remove the current list item (or update it as necessary)
        // If you want to remove the list item on edit (optional)
      list.remove();
    });

    // Handle Delete button click
    delete1.addEventListener('click', function () {
        // Remove the list item from the DOM
        list.remove();
        
        // You can also update income/expense values based on the deleted amount
        let type = document.querySelector('input[name="type"]:checked');
        let amount1 = parseFloat(document.getElementById('amount').value);
        
        if (type.value === 'expence') {
            let expencedis = document.getElementById('expencedis');
            let value = parseFloat(expencedis.innerText.replace(/,/g, '')) || 0;
            value += amount1;
            expencedis.innerText = value.toLocaleString();
            
            let incomedis = document.getElementById('incomedis');
            let value1 = parseFloat(incomedis.innerText.replace(/,/g, '')) || 0;
        let updatedIncome = value1 + amount1;
        incomedis.innerText = updatedIncome.toLocaleString();
        } else if (type.value === 'income') {
            let incomedis = document.getElementById('incomedis');
            let value = parseFloat(incomedis.innerText.replace(/,/g, '')) || 0;
            value -= amount1;
            incomedis.innerText = value.toLocaleString();

           
        
        }
    }); 

    // Handle type-based logic (Income/Expense update)
    let type11 = document.querySelector('input[name="type"]:checked');

    if (type11.value === 'income') {
        // Select the income display span
        let incomedis = document.getElementById('incomedis');
        let value = parseFloat(incomedis.innerText.replace(/,/g, '')) || 0;
        let amount1 = parseFloat(document.getElementById('amount').value) || 0;
        value += amount1;
        incomedis.innerText = value.toLocaleString();
    } else if (type11.value === 'expence') {
        // Select the expense display span
        let expencedis = document.getElementById('expencedis');
        let value = parseFloat(expencedis.innerText.replace(/,/g, '')) || 0;
        let amount1 = parseFloat(document.getElementById('amount').value) || 0;
        value -= amount1;
        expencedis.innerText = value.toLocaleString();

        // Update income if needed (if expense affects income)
        let incomedis = document.getElementById('incomedis');
        let value1 = parseFloat(incomedis.innerText.replace(/,/g, '')) || 0;
        let updatedIncome = value1 - amount1;
        incomedis.innerText = updatedIncome.toLocaleString();
    }
});







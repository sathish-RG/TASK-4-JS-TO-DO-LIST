 // DOM Elements
 const addBtn = document.getElementById('add-btn');
 const popup = document.getElementById('popup');
 const overlay = document.getElementById('overlay');
 const createBtn = document.getElementById('create');
 const cancelBtn = document.getElementById('cancel');
 const submitBtn = document.getElementById('submit');
 const expenseForm = document.getElementById('expense-form');
 const listContainer = document.getElementById('list-container');
 const incomeDisplay = document.getElementById('incomedis');
 const expenseDisplay = document.getElementById('expensedis');
 const netBalanceDisplay = document.getElementById('netbalancedis');
 const menuToggle = document.getElementById('menu-toggle');
 const menu = document.getElementById('menu');
 const filterButtons = document.querySelectorAll('.filter-btn');

 // State Management
 let totalIncome = 0;
 let totalExpense = 0;
 let netBalance = 0;
 let editingItem = null;
 let expenseList = [];

 // Load Data from Local Storage
 function loadFromLocalStorage() {
     const storedExpenses = localStorage.getItem('expenseList');
     const storedTotals = localStorage.getItem('expenseTotals');

     if (storedExpenses) {
         expenseList = JSON.parse(storedExpenses);
         expenseList.forEach(expense => {
             createListItem(
                 expense.title, 
                 expense.amount, 
                 expense.description, 
                 expense.type, 
                 false
             );
         });
     }

     if (storedTotals) {
         const totals = JSON.parse(storedTotals);
         totalIncome = totals.income;
         totalExpense = totals.expense;
         netBalance = totals.netBalance;

         incomeDisplay.textContent = `$${totalIncome.toLocaleString()}`;
         expenseDisplay.textContent = `$${totalExpense.toLocaleString()}`;
         netBalanceDisplay.textContent = `$${netBalance.toLocaleString()}`;

         // Restore net balance color
         if (netBalance > 0) {
             netBalanceDisplay.className = 'text-green-400 font-bold bg-black rounded-lg min-w-[5rem] p-1 text-center';
         } else if (netBalance < 0) {
             netBalanceDisplay.className = 'text-red-400 font-bold bg-black rounded-lg min-w-[5rem] p-1 text-center';
         } else {
             netBalanceDisplay.className = 'text-yellow-400 font-bold bg-black rounded-lg min-w-[5rem] p-1 text-center';
         }
     }
 }

 // Save Data to Local Storage
 function saveToLocalStorage() {
     localStorage.setItem('expenseList', JSON.stringify(expenseList));
     localStorage.setItem('expenseTotals', JSON.stringify({
         income: totalIncome,
         expense: totalExpense,
         netBalance: netBalance
     }));
 }

 // Show Popup
 function showPopup() {
     popup.classList.remove('hidden');
     popup.classList.add('flex');
     overlay.classList.remove('hidden');
 }

 // Hide Popup
 function hidePopup() {
     popup.classList.remove('flex');
     popup.classList.add('hidden');
     overlay.classList.add('hidden');
     expenseForm.reset();
     editingItem = null;
 }

 // Event Listeners for Popup
 addBtn.addEventListener('click', showPopup);
 createBtn.addEventListener('click', showPopup);
 cancelBtn.addEventListener('click', hidePopup);
 overlay.addEventListener('click', hidePopup);

 // Menu Toggle for Mobile
 menuToggle.addEventListener('click', () => {
     menu.classList.toggle('hidden');
 });

 // Handle Form Submission
 expenseForm.addEventListener('submit', (e) => {
     e.preventDefault();
     const title = document.getElementById('title').value;
     const amount = parseFloat(document.getElementById('amount').value);
     const description = document.getElementById('description').value;
     const type = document.querySelector('input[name="type"]:checked').value;

     if (editingItem) {
         // Update existing item
         updateListItem(editingItem, title, amount, description, type);
     } else {
         // Create new item
         createListItem(title, amount, description, type, true);
     }

     hidePopup();
 });

 // Create List Item
 function createListItem(title, amount, description, type, isNew = true) {
     const listItem = document.createElement('div');
     listItem.className = `listbox bg-white rounded-lg shadow-md p-4 ${type === 'income' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}`;
     listItem.setAttribute('data-type', type);

     listItem.innerHTML = `
         <h2 class="text-xl font-bold mb-2 ${type === 'income' ? 'text-green-600' : 'text-red-600'}">${title}</h2>
         <p class="text-lg font-semibold mb-2">$${amount.toLocaleString()}</p>
         <p class="text-gray-600 mb-4">${description}</p>
         <div class="flex justify-end space-x-2">
             <button class="edit-btn bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Edit</button>
             <button class="delete-btn bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
         </div>
     `;

     // Add event listeners for edit and delete
     const editBtn = listItem.querySelector('.edit-btn');
     const deleteBtn = listItem.querySelector('.delete-btn');

     editBtn.addEventListener('click', () => editListItem(listItem, title, amount, description, type));
     deleteBtn.addEventListener('click', () => deleteListItem(listItem, amount, type));

     listContainer.appendChild(listItem);

     // Update totals
     updateTotals(amount, type, 'add');

     // Add to expense list if it's a new item
     if (isNew) {
         expenseList.push({ title, amount, description, type });
         saveToLocalStorage();
     }
 }

 // Edit List Item
 function editListItem(listItem, title, amount, description, type) {
     editingItem = listItem;
     
     // Populate form
     document.getElementById('title').value = title;
     document.getElementById('amount').value = amount;
     document.getElementById('description').value = description;
     document.getElementById(type).checked = true;

     // Show popup
     showPopup();
 }

 // Update List Item
 function updateListItem(listItem, title, amount, description, type) {
     // Get the old amount and type
     const oldAmount = parseFloat(listItem.querySelector('.text-lg').textContent.replace('$', '').replace(',', ''));
     const oldType = listItem.getAttribute('data-type');

     // Remove old item's impact on totals
     updateTotals(oldAmount, oldType, 'subtract');

     // Update list item
     listItem.querySelector('.text-xl').textContent = title;
     listItem.querySelector('.text-xl').className = `text-xl font-bold mb-2 ${type === 'income' ? 'text-green-600' : 'text-red-600'}`;
     listItem.querySelector('.text-lg').textContent = `$${amount.toLocaleString()}`;
     listItem.querySelector('.text-gray-600').textContent = description;
     listItem.setAttribute('data-type', type);
     listItem.className = `listbox bg-white rounded-lg shadow-md p-4 ${type === 'income' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}`;

     // Add new item's impact on totals
     updateTotals(amount, type, 'add');

     // Update in expense list
     // (Previous code remains the same, continuing with the script)

     // Find and update the item in expenseList
     const index = expenseList.findIndex(item => 
         item.title === title && 
         item.amount === oldAmount && 
         item.type === oldType
     );

     if (index !== -1) {
         expenseList[index] = { title, amount, description, type };
         saveToLocalStorage();
     }
 }

 // Delete List Item
 function deleteListItem(listItem, amount, type) {
     // Remove from DOM
     listContainer.removeChild(listItem);

     // Update totals
     updateTotals(amount, type, 'subtract');

     // Remove from expenseList
     const index = expenseList.findIndex(item => 
         item.amount === amount && 
         item.type === type
     );

     if (index !== -1) {
         expenseList.splice(index, 1);
         saveToLocalStorage();
     }
 }

 // Update Totals
 function updateTotals(amount, type, action) {
     if (type === 'income') {
         totalIncome = action === 'add' 
             ? totalIncome + amount 
             : totalIncome - amount;
         incomeDisplay.textContent = `$${totalIncome.toLocaleString()}`;
     } else {
         totalExpense = action === 'add' 
             ? totalExpense + amount 
             : totalExpense - amount;
         expenseDisplay.textContent = `$${totalExpense.toLocaleString()}`;
     }

     // Calculate Net Balance
     netBalance = totalIncome - totalExpense;
     netBalanceDisplay.textContent = `$${netBalance.toLocaleString()}`;

     // Color-code Net Balance
     if (netBalance > 0) {
         netBalanceDisplay.className = 'text-green-400 font-bold bg-black rounded-lg min-w-[5rem] p-1 text-center';
     } else if (netBalance < 0) {
         netBalanceDisplay.className = 'text-red-400 font-bold bg-black rounded-lg min-w-[5rem] p-1 text-center';
     } else {
         netBalanceDisplay.className = 'text-yellow-400 font-bold bg-black rounded-lg min-w-[5rem] p-1 text-center';
     }

     // Save updated totals
     saveToLocalStorage();
 }

 // Filter List
 filterButtons.forEach(button => {
     button.addEventListener('click', () => {
         const filterType = button.getAttribute('data-type');
         const listItems = document.querySelectorAll('.listbox');

         listItems.forEach(item => {
             if (filterType === 'all' || item.getAttribute('data-type') === filterType) {
                 item.style.display = 'block';
             } else {
                 item.style.display = 'none';
             }
         });
     });
 });

 // Load data when page loads
 document.addEventListener('DOMContentLoaded', loadFromLocalStorage);
const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const category = document.getElementById('category');
const filter = document.getElementById('filter');
const monthFilter = document.getElementById('monthFilter');
const pieChartCanvas = document.getElementById('expensePieChart');
const barChartCanvas = document.getElementById('incomeExpenseBarChart');
const toggleDarkModeBtn = document.getElementById('toggleDarkMode');

let transactions = [];

// Pie Chart
let expensePieChart = new Chart(pieChartCanvas, {
  type: 'pie',
  data: {
    labels: [],
    datasets: [{
      label: 'Expenses by Category',
      data: [],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8e44ad', '#2ecc71', '#e67e22'],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#111' }
      }
    }
  }
});

// Bar Chart
let incomeExpenseBarChart = new Chart(barChartCanvas, {
  type: 'bar',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Income',
        data: [],
        backgroundColor: '#2ecc71'
      },
      {
        label: 'Expenses',
        data: [],
        backgroundColor: '#e74c3c'
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#111' }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#111' },
        grid: { color: '#ccc' }
      },
      x: {
        ticks: { color: '#111' },
        grid: { color: '#ccc' }
      }
    }
  }
});

form.addEventListener('submit', addTransaction);
filter.addEventListener('change', filterTransactions);
monthFilter.addEventListener('change', filterTransactions);

function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '' || category.value === '') {
    alert('Please fill in all fields');
    return;
  }

  const transaction = {
    id: generateID(),
    text: text.value,
    amount: +amount.value,
    category: category.value,
    date: new Date().toLocaleString()
  };

  transactions.push(transaction);
  text.value = '';
  amount.value = '';
  category.value = '';

  updateLocalStorage();
  init();
}

function generateID() {
  return Math.floor(Math.random() * 1000000);
}

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  item.innerHTML = `
    <div>
      <strong>${transaction.text}</strong><br>
      <small>${transaction.date}</small>
    </div>
    <div>
      <span>${sign}$${Math.abs(transaction.amount)}</span><br>
      <small>[${transaction.category}]</small>
      <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    </div>
  `;
  list.appendChild(item);
}

function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1
  ).toFixed(2);

  balance.innerText = `$${total}`;
  money_plus.innerText = `+$${income}`;
  money_minus.innerText = `-$${expense}`;
}

function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

function updateChart() {
  const expenseData = transactions.reduce((acc, tx) => {
    if (tx.amount < 0) {
      acc[tx.category] = (acc[tx.category] || 0) + Math.abs(tx.amount);
    }
    return acc;
  }, {});

  expensePieChart.data.labels = Object.keys(expenseData);
  expensePieChart.data.datasets[0].data = Object.values(expenseData);
  expensePieChart.update();

  const incomeMap = {};
  const expenseMap = {};

  transactions.forEach(tx => {
    const cat = tx.category;
    if (tx.amount > 0) {
      incomeMap[cat] = (incomeMap[cat] || 0) + tx.amount;
    } else {
      expenseMap[cat] = (expenseMap[cat] || 0) + Math.abs(tx.amount);
    }
  });

  const allCategories = [...new Set([...Object.keys(incomeMap), ...Object.keys(expenseMap)])];
  const incomeData = allCategories.map(cat => incomeMap[cat] || 0);
  const expenseDataBar = allCategories.map(cat => expenseMap[cat] || 0);

  incomeExpenseBarChart.data.labels = allCategories;
  incomeExpenseBarChart.data.datasets[0].data = incomeData;
  incomeExpenseBarChart.data.datasets[1].data = expenseDataBar;
  incomeExpenseBarChart.update();
}

function filterTransactions() {
  const selectedCategory = filter.value;
  const selectedMonth = monthFilter.value;

  let filtered = [...transactions];

  if (selectedCategory !== 'All') {
    filtered = filtered.filter(tx => tx.category === selectedCategory);
  }

  if (selectedMonth !== 'All') {
    filtered = filtered.filter(tx => {
      const month = new Date(tx.date).toLocaleString('default', { month: 'long' });
      return month === selectedMonth;
    });
  }

  list.innerHTML = '';
  filtered.forEach(addTransactionDOM);
}

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function applyChartDarkMode(isDark) {
    const fontColor = isDark ? '#e0e0e0' : '#111';
    const bgColor = isDark ? '#1e1e1e' : '#fff';
  
    [expensePieChart, incomeExpenseBarChart].forEach(chart => {
      chart.options.plugins.legend.labels.color = fontColor;
      if (chart.config.type === 'bar') {
        chart.options.scales = {
          y: {
            beginAtZero: true,
            ticks: { color: fontColor },
            grid: { color: isDark ? '#333' : '#ccc' }
          },
          x: {
            ticks: { color: fontColor },
            grid: { color: isDark ? '#333' : '#ccc' }
          }
        };
      }
      chart.update();
    });
  }
  
  toggleDarkModeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    toggleDarkModeBtn.innerText = isDark ? '☀️' : '🌙'; // Change icon on toggle
    applyChartDarkMode(isDark);
  });

// Apply mode on load
function applySavedMode() {
  const isDark = localStorage.getItem('darkMode') === 'enabled';
  if (isDark) document.body.classList.add('dark-mode');
  applyChartDarkMode(isDark);
}

document.getElementById('exportCSV').addEventListener('click', () => {
  let csvContent = 'data:text/csv;charset=utf-8,';
  csvContent += 'Date,Description,Amount,Category\n';

  transactions.forEach(tx => {
    csvContent += `"${tx.date}","${tx.text}",${tx.amount},"${tx.category}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'expense_tracker.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

function populateMonthFilter() {
  const months = [...new Set(transactions.map(tx => {
    return new Date(tx.date).toLocaleString('default', { month: 'long' });
  }))];

  monthFilter.innerHTML = `<option value="All">All Months</option>`;
  months.forEach(month => {
    const option = document.createElement('option');
    option.value = month;
    option.innerText = month;
    monthFilter.appendChild(option);
  });
}


if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    toggleDarkModeBtn.innerText = '☀️';
    applyChartDarkMode(true);
  } else {
    toggleDarkModeBtn.innerText = '🌙';
  }
function init() {
  const localData = localStorage.getItem('transactions');
  transactions = localData ? JSON.parse(localData) : [];

  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
  updateChart();
  filterTransactions();
  populateMonthFilter();
  applySavedMode();
}

init();

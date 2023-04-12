// Get form inputs 
const loanAmountInput = document.getElementById('loanAmount');
const interestRateInput = document.getElementById('interestRate');
const loanTermInput = document.getElementById('loanTerm');
const downPaymentInput = document.getElementById('downPayment');
const propertyTaxInput = document.getElementById('propertyTax');
const homeownersInsuranceInput = document.getElementById('homeownersInsurance');
const pmiInput = document.getElementById('pmi');
const hoaFeesInput = document.getElementById('hoaFees');

// Get chart and result elements
const myChart = document.getElementById('myChart').getContext('2d');
const chartLabel = document.querySelector('.chart-label .value');
const resultDiv = document.getElementById('result');

// Get show graph button element
const showGraphBtn = document.getElementById('showGraphBtn');

// Add event listener to show graph button
showGraphBtn.addEventListener('click', function() {
  // Call update method to show graph
  myChartObj.update();
  // Set chart canvas element to visible
  canvas.style.display = 'block';
});

// Define chart colors
const chartColors = {
  mortgage: '#0077be',
  propertyTax: '#00cc99',
  insurance: '#ff4444',
  pmi: '#ffd633',
  hoaFees: '#9966cc'
};

// Initialize chart data
const chartData = {
  labels: [],
  datasets: [
    {
      label: 'Mortgage Payment',
      backgroundColor: chartColors.mortgage,
      data: []
    },
    {
      label: 'Property Tax',
      backgroundColor: chartColors.propertyTax,
      data: []
    },
    {
      label: 'Insurance',
      backgroundColor: chartColors.insurance,
      data: []
    },
    {
      label: 'PMI',
      backgroundColor: chartColors.pmi,
      data: []
    },
    {
      label: 'HOA Fees',
      backgroundColor: chartColors.hoaFees,
      data: []
    }
  ]
};

// Initialize chart options
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          callback: function(value, index, values) {
            return '$' + value.toFixed(2);
          }
        }
      }]
    },
    tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            let label = data.datasets[tooltipItem.datasetIndex].label || '';
            label += ': $' + tooltipItem.yLabel.toFixed(2);
            return label;
          }
        }
      },
    legend: {
        position: 'bottom' // change position of legend to top
      }
  };

// Initialize chart object
const myChartObj = new Chart(myChart, {
  type: 'bar',
  data: chartData,
  options: chartOptions
});

// Define function to calculate mortgage
function calculateMortgage() {
  // Get input values
  const loanAmount = Number(loanAmountInput.value);
  const interestRate = Number(interestRateInput.value) / 100 / 12;
  const loanTerm = Number(loanTermInput.value) * 12;
  const downPayment = Number(downPaymentInput.value) || 0;
  const propertyTaxRate = Number(propertyTaxInput.value) / 100 / 12;
  const homeownersInsurance = Number(homeownersInsuranceInput.value) || 0;
  const pmiRate = Number(pmiInput.value) / 100 / 12;
  const hoaFees = Number(hoaFeesInput.value) || 0;

  // Calculate mortgage payment
  const principal = loanAmount - downPayment;
  const mortgage = (principal * (interestRate * Math.pow(1 + interestRate, loanTerm))) / (Math.pow(1 + interestRate, loanTerm) - 1);
  const totalMortgage = mortgage + (pmiRate * principal)
  chartData.datasets[0].data.push(totalMortgage);

  
  // Calculate other costs
  let propertyTax = principal * propertyTaxRate;
  chartData.datasets[1].data.push(propertyTax);
  let insurance = homeownersInsurance;
  chartData.datasets[2].data.push(insurance);
  let pmi = pmiRate * principal;
  chartData.datasets[3].data.push(pmi);
  let hoa = hoaFees;
  chartData.datasets[4].data.push(hoa);

  // Calculate total monthly cost
  const totalCost = mortgage + propertyTax + insurance + pmi + hoa;
  chartLabel.innerText = '$' + totalCost.toFixed(2);

  return {
    mortgage,
    propertyTax,
    insurance,
    pmi,
    hoa,
    totalCost
  };
}

// Define function to display results
function displayResults(results) {
  let resultHTML = '<div class="row">';
  resultHTML += '<div class="col-md-6"><strong>Mortgage Payment:</strong></div>';
  resultHTML += '<div class="col-md-6">$' + results.mortgage.toFixed(2) + '</div>';
  resultHTML += '</div>';
  resultHTML += '<div class="row">';
  resultHTML += '<div class="col-md-6"><strong>Property Tax:</strong></div>';
  resultHTML += '<div class="col-md-6">$' + results.propertyTax.toFixed(2) + '</div>';
  resultHTML += '</div>';
  resultHTML += '<div class="row">';
  resultHTML += '<div class="col-md-6"><strong>Homeowner\'s Insurance:</strong></div>';
  resultHTML += '<div class="col-md-6">$' + results.insurance.toFixed(2) + '</div>';
  resultHTML += '</div>';
  resultHTML += '<div class="row">';
  resultHTML += '<div class="col-md-6"><strong>PMI:</strong></div>';
  resultHTML += '<div class="col-md-6">$' + results.pmi.toFixed(2) + '</div>';
  resultHTML += '</div>';
  resultHTML += '<div class="row">';
  resultHTML += '<div class="col-md-6"><strong>HOA Fees:</strong></div>';
  resultHTML += '<div class="col-md-6">$' + results.hoa.toFixed(2) + '</div>';
  resultHTML += '</div>';
  resultHTML += '<div class="row">';
  resultHTML += '<div class="col-md-6"><strong>Total Monthly Cost:</strong></div>';
  resultHTML += '<div class="col-md-6">$' + results.totalCost.toFixed(2) + '</div>';
  resultHTML += '</div>';

  resultDiv.innerHTML = resultHTML;
}

// Define function to reset chart and results
function resetCalculator() {
  chartData.datasets.forEach(dataset => {
    dataset.data = [];
  });
  myChartObj.update();
  chartLabel.innerText = '$0';
  resultDiv.innerHTML = '';
}

// Define calculate function to trigger calculation and display results
function calculate() {
  resetCalculator();
  const results = calculateMortgage();
  displayResults(results);
}

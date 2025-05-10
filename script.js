let inventory = [];
let salesRecords = [];
let invoicesRecords = [];
let archivedInvoices = [];
let currentSaleItems = [];
let currentInvoiceItems = [];
let invoiceTotal = 0;
let currentInvoiceNumber = generateInvoiceNumber();
let returnSalesRecords = [];
let currentReturnSalesItems = [];
let returnInvoicesRecords = [];
let currentReturnInvoicesItems = [];

function generateInvoiceNumber() {
    return Math.floor(Math.random() * 1000000);
}

function login() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorElement = document.getElementById('login-error');
    const loginContainer = document.getElementById('login-container');
    const dashboardContainer = document.getElementById('dashboard-container');

    if (usernameInput.value === '1234' && passwordInput.value === '1234') {
        loginContainer.style.display = 'none';
        dashboardContainer.style.display = 'block';
        showSection('inventory'); // عرض قسم المخزون افتراضيًا بعد تسجيل الدخول
    } else {
        errorElement.style.display = 'block';
    }
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
        if (sectionId === 'inventory') {
            showInventory();
        } else if (sectionId === 'sales') {
            displayCurrentSale();
        } else if (sectionId === 'invoice') {
            displayCurrentInvoice();
            document.getElementById('invoice-number-display').textContent = currentInvoiceNumber;
            document.getElementById('invoice-date-display').textContent = new Date().toLocaleDateString();
        } else if (sectionId === 'returns_sales') {
            displayCurrentReturnSales();
        } else if (sectionId === 'returns_invoices') {
            displayCurrentReturnInvoices();
        } else if (sectionId === 'records') {
            // عند إظهار قسم السجلات، لا تقم بإظهار أي قسم فرعي افتراضيًا
            const innerSections = document.querySelectorAll('.inner-section');
            innerSections.forEach(innerSection => {
                innerSection.style.display = 'none';
            });
        }
    }
}

function addProduct() {
    const nameInput = document.getElementById('new-product-name');
    const quantityInput = document.getElementById('new-product-quantity');
    const priceInput = document.getElementById('new-product-price');

    const name = nameInput.value.trim();
    const quantity = parseInt(quantityInput.value);
    const price = parseFloat(priceInput.value);

    if (name && !isNaN(quantity) && !isNaN(price)) {
        const existingProduct = inventory.find(product => product.name === name);
        if (existingProduct) {
            existingProduct.quantity += quantity;
            existingProduct.price = price; // تحديث السعر إذا كان المنتج موجودًا
        } else {
            inventory.push({ name: name, quantity: quantity, price: price });
        }
        nameInput.value = '';
        quantityInput.value = '';
        priceInput.value = '';
        showInventory();
    } else {
        alert('الرجاء إدخال اسم المنتج والكمية والسعر بشكل صحيح.');
    }
}

function showInventory() {
    const inventoryBody = document.getElementById('inventory-body');
    inventoryBody.innerHTML = '';
    inventory.forEach(product => {
        const row = inventoryBody.insertRow();
        const nameCell = row.insertCell();
        const quantityCell = row.insertCell();
        const priceCell = row.insertCell();
        const actionsCell = row.insertCell();

        nameCell.textContent = product.name;
        quantityCell.textContent = product.quantity;
        priceCell.textContent = product.price;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'حذف';
        deleteButton.onclick = () => deleteProduct(product.name);
        actionsCell.appendChild(deleteButton);
    });
}

function deleteProduct(productName) {
    inventory = inventory.filter(product => product.name !== productName);
    showInventory();
}

function updateQuantity() {
    const nameInput = document.getElementById('update-quantity-name');
    const quantityInput = document.getElementById('update-quantity-value');
    const name = nameInput.value.trim();
    const quantity = parseInt(quantityInput.value);

    if (name && !isNaN(quantity)) {
        const product = inventory.find(p => p.name === name);
        if (product) {
            product.quantity = quantity;
            showInventory();
            nameInput.value = '';
            quantityInput.value = '';
        } else {
            alert('المنتج غير موجود في المخزون.');
        }
    } else {
        alert('الرجاء إدخال اسم المنتج والكمية الجديدة بشكل صحيح.');
    }
}

function updatePrice() {
    const nameInput = document.getElementById('update-price-name');
    const priceInput = document.getElementById('update-price-value');
    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);

    if (name && !isNaN(price)) {
        const product = inventory.find(p => p.name === name);
        if (product) {
            product.price = price;
            showInventory();
            nameInput.value = '';
            priceInput.value = '';
        } else {
            alert('المنتج غير موجود في المخزون.');
        }
    } else {
        alert('الرجاء إدخال اسم المنتج والسعر الجديد بشكل صحيح.');
    }
}

function searchProducts() {
    const searchInput = document.getElementById('search-product').value.toLowerCase();
    const filteredProducts = inventory.filter(product =>
        product.name.toLowerCase().includes(searchInput)
    );
    displayFilteredInventory(filteredProducts);
}

function displayFilteredInventory(products) {
    const inventoryBody = document.getElementById('inventory-body');
    inventoryBody.innerHTML = '';
    products.forEach(product => {
        const row = inventoryBody.insertRow();
        const nameCell = row.insertCell();
        const quantityCell = row.insertCell();
        const priceCell = row.insertCell();
        const actionsCell = row.insertCell();

        nameCell.textContent = product.name;
        quantityCell.textContent = product.quantity;
        priceCell.textContent = product.price;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'حذف';
        deleteButton.onclick = () => deleteProduct(product.name);
        actionsCell.appendChild(deleteButton);
    });
}

function addSalesItem() {
    const nameInput = document.getElementById('sales-product-name');
    const quantityInput = document.getElementById('sales-product-quantity');
    const priceInput = document.getElementById('sales-product-price');

    const name = nameInput.value.trim();
    const quantity = parseInt(quantityInput.value);
    const price = parseFloat(priceInput.value);

    if (name && !isNaN(quantity) && quantity > 0) {
        const existingProductInInventory = inventory.find(product => product.name === name);
        if (existingProductInInventory && existingProductInInventory.quantity >= quantity) {
            const salesItem = {
                name: name,
                quantity: quantity,
                price: isNaN(price) ? existingProductInInventory.price : price
            };
            currentSaleItems.push(salesItem);
            nameInput.value = '';
            quantityInput.value = '';
            priceInput.value = '';
            displayCurrentSale();
        } else if (!existingProductInInventory) {
            alert('المنتج الذي أدخلته غير موجود في المخزون.');
        } else {
            alert(`الكمية المطلوبة من "${name}" غير متوفرة في المخزون. الكمية المتوفرة: ${existingProductInInventory.quantity}`);
        }
    } else {
        alert('الرجاء إدخال اسم المنتج والكمية بشكل صحيح (يجب أن تكون الكمية أكبر من 0).');
    }
}

function removeSalesItem(productName) {
    currentSaleItems = currentSaleItems.filter(item => item.name !== productName);
    displayCurrentSale();
}

function displayCurrentSale() {
    const salesBody = document.getElementById('sales-body');
    salesBody.innerHTML = '';
    currentSaleItems.forEach(item => {
        const row = salesBody.insertRow();
        const nameCell = row.insertCell();
        const quantityCell = row.insertCell();
        const priceCell = row.insertCell();
        const actionsCell = row.insertCell();

        nameCell.textContent = item.name;
        quantityCell.textContent = item.quantity;
        priceCell.textContent = item.price;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'حذف';
        deleteButton.onclick = () => removeSalesItem(item.name);
        actionsCell.appendChild(deleteButton);
    });
}

function registerSale() {
    if (currentSaleItems.length > 0) {
        const customerNameInput = document.getElementById('customer-name');
        const customerName = customerNameInput.value.trim();
        const saleDate = new Date().toLocaleDateString();
        const soldItems = [];
        let saleSuccessful = true;

        for (const item of currentSaleItems) {
            const inventoryIndex = inventory.findIndex(product => product.name === item.name);
            if (inventoryIndex !== -1 && inventory[inventoryIndex].quantity >= item.quantity) {
                inventory[inventoryIndex].quantity -= item.quantity;
                soldItems.push({ name: item.name, quantity: item.quantity, price: item.price });
            } else {
                alert(`خطأ: الكمية المطلوبة من "${item.name}" غير متوفرة في المخزون.`);
                saleSuccessful = false;
                break;
            }
        }

        if (saleSuccessful) {
            salesRecords.push({ customer: customerName, date: saleDate, items: soldItems });
            currentSaleItems = [];
            displayCurrentSale();
            showInventory();
            alert('تم تسجيل عملية البيع بنجاح.');
            if (document.getElementById('sales_log').style.display === 'block') {
                displaySalesLog();
            }
        }
    } else {
        alert('لا يوجد منتجات في قائمة البيع لتسجيلها.');
    }
}

function addInvoiceItem() {
    const name = document.getElementById("invoice-product-name").value;
    const quantity = parseInt(document.getElementById("invoice-product-quantity").value);
    const price = parseFloat(document.getElementById("invoice-product-price").value);

    if (name && !isNaN(quantity) && !isNaN(price)) {
        const itemTotal = quantity * price; // حساب الإجمالي الفرعي للمنتج
        const newItem = { name: name, quantity: quantity, price: price, itemTotal: itemTotal };
        currentInvoiceItems.push(newItem);
        invoiceTotal += itemTotal; // تحديث الإجمالي الكلي للفاتورة
        displayCurrentInvoice(); // إعادة عرض الجدول مع الإجمالي
        clearInputFields();
    } else {
        alert("يرجى إدخال اسم المنتج والكمية والسعر بشكل صحيح.");
    }
}
function clearInputFields() {
    document.getElementById("invoice-product-name").value = "";
    document.getElementById("invoice-product-quantity").value = "";
    document.getElementById("invoice-product-price").value = "";
}

function removeInvoiceItem(productName) {
    const itemToRemove = currentInvoiceItems.find(item => item.name === productName);
    if (itemToRemove) {
        invoiceTotal -= itemToRemove.itemTotal; // خصم إجمالي المنتج المحذوف من الإجمالي الكلي
        currentInvoiceItems = currentInvoiceItems.filter(item => item.name !== productName);
        displayCurrentInvoice();
    }
}


function displayCurrentInvoice() {
    const invoiceBody = document.getElementById('invoice-body');
    invoiceBody.innerHTML = '';

    currentInvoiceItems.forEach(item => {
        const row = invoiceBody.insertRow();
        const nameCell = row.insertCell();
        const quantityCell = row.insertCell();
        const priceCell = row.insertCell();
        const itemTotalCell = row.insertCell();
        const actionsCell = row.insertCell();

        nameCell.textContent = item.name;
        quantityCell.textContent = item.quantity;
        priceCell.textContent = item.price;
        itemTotalCell.textContent = item.itemTotal.toFixed(2);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'حذف';
        deleteButton.onclick = () => removeInvoiceItem(item.name);
        actionsCell.appendChild(deleteButton);
    });

    // إضافة صف لعرض الإجمالي الكلي
    const totalRow = invoiceBody.insertRow();
    const totalLabelCell = totalRow.insertCell();
    const totalValueCell = totalRow.insertCell();
    totalLabelCell.colSpan = 4; // دمج الخلايا لجميع الأعمدة
    totalLabelCell.textContent = 'الإجمالي الكلي:';
    totalValueCell.textContent = invoiceTotal.toFixed(2);
    totalValueCell.style.fontWeight = 'bold';
    totalValueCell.style.textAlign = 'right'; // محاذاة القيمة إلى اليمين
}

function saveInvoice() {
    if (currentInvoiceItems.length > 0) {
        const customerNameInput = document.getElementById('invoice-customer-name');
        const customerName = customerNameInput.value.trim();
        const invoiceDate = new Date().toLocaleDateString();
        const itemsToSave = [];
        let invoiceSuccessful = true;

        for (const item of currentInvoiceItems) {
            const inventoryIndex = inventory.findIndex(product => product.name === item.name);
            if (inventoryIndex !== -1 && inventory[inventoryIndex].quantity >= item.quantity) {
                inventory[inventoryIndex].quantity -= item.quantity;
                itemsToSave.push({ name: item.name, quantity: item.quantity, price: item.price });
            } else {
                alert(`خطأ: الكمية المطلوبة من "${item.name}" غير متوفرة في المخزون.`);
                invoiceSuccessful = false;
                break;
            }
        }

        if (invoiceSuccessful) {
            const newInvoice = {
                invoiceNumber: currentInvoiceNumber,
                customer: customerName,
                date: invoiceDate,
                items: itemsToSave
            };
            invoicesRecords.push(newInvoice);
            currentInvoiceItems = [];
            displayCurrentInvoice();
            showInventory();
            currentInvoiceNumber = generateInvoiceNumber();
            document.getElementById('invoice-number-display').textContent = currentInvoiceNumber;
            document.getElementById('invoice-date-display').textContent = invoiceDate;
            alert(`تم حفظ الفاتورة رقم ${newInvoice.invoiceNumber} بنجاح.`);
            if (document.getElementById('invoices_log').style.display === 'block') {
                displayInvoicesLog();
            }
        }
    } else {
        alert('لا يوجد منتجات في الفاتورة لحفظها.');
    }
}

function archiveInvoice() {
    if (currentInvoiceItems.length > 0) {
        const customerNameInput = document.getElementById('invoice-customer-name');
        const customerName = customerNameInput.value.trim();
        const archiveDate = new Date().toLocaleDateString();
        const itemsToArchive = [];

        for (const item of currentInvoiceItems) {
            itemsToArchive.push({ name: item.name, quantity: item.quantity, price: item.price });
        }

        const archivedInvoice = {
            invoiceNumber: currentInvoiceNumber,
            customer: customerName,
            date: archiveDate,
            items: itemsToArchive
        };
        archivedInvoices.push(archivedInvoice);
        currentInvoiceItems = [];
        displayCurrentInvoice();
        currentInvoiceNumber = generateInvoiceNumber();
        document.getElementById('invoice-number-display').textContent = currentInvoiceNumber;
        document.getElementById('invoice-date-display').textContent = archiveDate;
        alert(`تم أرشفة الفاتورة رقم ${archivedInvoice.invoiceNumber} بنجاح.`);
        if (document.getElementById('invoices_archive').style.display === 'block') {
            displayArchivedInvoices();
        }
    } else {
        alert('لا يوجد منتجات في الفاتورة لأرشفتها.');
    }
}

function printInvoice() {
    if (currentInvoiceItems.length > 0) {
        const customerNameInput = document.getElementById('invoice-customer-name');
        const customerName = customerNameInput.value.trim();
        const invoiceDate = new Date().toLocaleDateString();
        let invoiceDetails = `<h2>فاتورة رقم: ${currentInvoiceNumber}</h2>`;
        invoiceDetails += `<p>تاريخ الإصدار: ${invoiceDate}</p>`;
        invoiceDetails += `<p>اسم العميل: ${customerName}</p>`;
        invoiceDetails += `<table><thead><tr><th>اسم المنتج</th><th>الكمية</th><th>السعر</th></tr></thead><tbody>`;
        currentInvoiceItems.forEach(item => {
            invoiceDetails += `<tr><td><span class="math-inline">\{item\.name\}</td\><td\></span>{item.quantity}</td><td>${item.price}</td></tr>`;
        });
        invoiceDetails += `</tbody></table>`;

        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>فاتورة</title><style>table {width: 100%; border-collapse: collapse;} th, td {border: 1px solid black; padding: 8px; text-align: right;}</style></head><body>');
        printWindow.document.write(invoiceDetails);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    } else {
        alert('لا يوجد منتجات في الفاتورة لطباعتها.');
    }
}

function addReturnSalesItem() {
    const nameInput = document.getElementById('returns-sales-product-name');
    const quantityInput = document.getElementById('returns-sales-product-quantity');
    const priceInput = document.getElementById('returns-sales-product-price');

    const name = nameInput.value.trim();
    const quantity = parseInt(quantityInput.value);
    const price = parseFloat(priceInput.value);

    if (name && !isNaN(quantity) && quantity > 0) {
        const existingProductInInventory = inventory.find(product => product.name === name);
        if (existingProductInInventory) {
            const returnSalesItem = {
                name: name,
                quantity: quantity,
                price: isNaN(price) ? existingProductInInventory.price : price
            };
            currentReturnSalesItems.push(returnSalesItem);
            nameInput.value = '';
            quantityInput.value = '';
            priceInput.value = '';
            displayCurrentReturnSales(); // تحديث الجدول بعد إضافة المنتج
        } else {
            alert('المنتج الذي أدخلته غير موجود في المخزون.');
        }
    } else {
        alert('الرجاء إدخال اسم المنتج والكمية بشكل صحيح (يجب أن تكون الكمية أكبر من 0).');
    }
}

function removeReturnSalesItem(productName) {
    currentReturnSalesItems = currentReturnSalesItems.filter(item => item.name !== productName);
    displayCurrentReturnSales();
}

function displayCurrentReturnSales() {
    const returnSalesBody = document.getElementById('returns-sales-body');
    returnSalesBody.innerHTML = '';

    currentReturnSalesItems.forEach(item => {
        const row = returnSalesBody.insertRow();

        const nameCell = row.insertCell();
        nameCell.textContent = item.name;

        const quantityCell = row.insertCell();
        quantityCell.textContent = item.quantity;

        const priceCell = row.insertCell();
        priceCell.textContent = item.price;

        const actionsCell = row.insertCell();
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'حذف';
        deleteButton.onclick = () => removeReturnSalesItem(item.name);
        actionsCell.appendChild(deleteButton);
    });
}

function saveReturnSales() {
    if (currentReturnSalesItems.length > 0) {
        const customerNameInput = document.getElementById('returns-sales-customer-name');
        const customerName = customerNameInput.value.trim();
        const returnDate = new Date().toLocaleDateString();
        const returnedItems = [];
        let returnSuccessful = true;
        let originalSaleIndex = -1;

        // البحث عن آخر عملية بيع بنفس اسم العميل
        originalSaleIndex = salesRecords.findLastIndex(record => record.customer === customerName);

        if (originalSaleIndex !== -1) {
            for (const returnItem of currentReturnSalesItems) {
                const soldItemIndex = salesRecords[originalSaleIndex].items.findIndex(
                    item => item.name === returnItem.name
                );

                if (soldItemIndex !== -1 && salesRecords[originalSaleIndex].items[soldItemIndex].quantity >= returnItem.quantity) {
                    salesRecords[originalSaleIndex].items[soldItemIndex].quantity -= returnItem.quantity;
                    const inventoryIndex = inventory.findIndex(product => product.name === returnItem.name);
                    if (inventoryIndex !== -1) {
                        inventory[inventoryIndex].quantity += returnItem.quantity;
                        returnedItems.push({
                            name: returnItem.name,
                            quantity: returnItem.quantity,
                            price: returnItem.price
                        });
                    } else {
                        alert(`خطأ: المنتج "${returnItem.name}" غير موجود في المخزون.`);
                        returnSuccessful = false;
                        break;
                    }
                } else {
                    alert(`الكمية المرتجعة من "<span class="math-inline">\{returnItem\.name\}" أكبر من الكمية المباعة للعميل "</span>{customerName}".`);
                    returnSuccessful = false;
                    break;
                }
            }

            if (returnSuccessful) {
                returnSalesRecords.push({
                    customer: customerName,
                    date: returnDate,
                    items: returnedItems
                });
                currentReturnSalesItems = [];
                displayCurrentReturnSales();
                showInventory();
                alert('تم تسجيل المرتجع بنجاح.');
                if (document.getElementById('returns_sales_log').style.display === 'block') {
                    displayReturnSalesLog();
                }
            }
        } else {
            alert(`لم يتم العثور على مبيعات للعميل "${customerName}".`);
        }
    } else {
        alert('لا يوجد منتجات في قائمة المرتجع لحفظها.');
    }
}

function displayReturnSalesLog() {
    const returnSalesLogBody = document.getElementById('returns-sales-log-body');
    returnSalesLogBody.innerHTML = '';

    if (returnSalesRecords.length > 0) {
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.marginTop = '10px';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['رقم مرتجع المبيعات', 'اسم العميل', 'تاريخ المرتجع', 'العمليات']; // تم إرجاع "العمليات"
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            th.style.border = '1px solid #ddd';
            th.style.padding = '8px';
            th.style.textAlign = 'right';
            th.style.backgroundColor = '#f2f2f2';
            th.style.fontWeight = 'bold';
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        returnSalesRecords.forEach((record, index) => {
            const row = document.createElement('tr');

            const returnSaleNumberCell = document.createElement('td');
            returnSaleNumberCell.textContent = record.returnSaleNumber || `RS-${index + 1}`;
            returnSaleNumberCell.style.border = '1px solid #ddd';
            returnSaleNumberCell.style.padding = '8px';
            returnSaleNumberCell.style.textAlign = 'right';
            row.appendChild(returnSaleNumberCell);

            const customerCell = document.createElement('td');
            customerCell.textContent = record.customer;
            customerCell.style.border = '1px solid #ddd';
            customerCell.style.padding = '8px';
            customerCell.style.textAlign = 'right';
            row.appendChild(customerCell);

            const dateCell = document.createElement('td');
            dateCell.textContent = record.date;
            dateCell.style.border = '1px solid #ddd';
            dateCell.style.padding = '8px';
            dateCell.style.textAlign = 'right';
            row.appendChild(dateCell);

            const actionsCell = document.createElement('td');
            const detailsButton = document.createElement('button');
            detailsButton.textContent = 'عرض التفاصيل';
            detailsButton.onclick = () => showReturnSaleDetails(record, row);
            actionsCell.appendChild(detailsButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'حذف المرتجع';
            deleteButton.onclick = () => deleteReturnSale(index);
            actionsCell.appendChild(deleteButton);

            actionsCell.style.border = '1px solid #ddd';
            actionsCell.style.padding = '8px';
            actionsCell.style.textAlign = 'right';
            row.appendChild(actionsCell);

            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        returnSalesLogBody.appendChild(table);
    } else {
        const noRecordsMessage = document.createElement('p');
        noRecordsMessage.textContent = 'لا يوجد مرتجعات مبيعات مسجلة.';
        returnSalesLogBody.appendChild(noRecordsMessage);
    }
}

function deleteReturnSale(index) {
    if (confirm('هل أنت متأكد أنك تريد حذف مرتجع المبيعات هذا؟')) {
        returnSalesRecords.splice(index, 1);
        displayReturnSalesLog(); // تحديث عرض سجل مرتجع المبيعات
        // يمكنك هنا إضافة منطق لحفظ التغييرات
    }
}
function showReturnSaleDetails(record, mainRow) {
    // التحقق إذا كان جدول التفاصيل معروضًا بالفعل لهذا الصف
    const existingDetailsRow = mainRow.nextElementSibling;
    if (existingDetailsRow && existingDetailsRow.classList.contains('details-row')) {
        existingDetailsRow.remove(); // إخفاء التفاصيل إذا كانت معروضة
        return;
    }

    const detailsRow = document.createElement('tr');
    detailsRow.classList.add('details-row');
    const detailsCell = document.createElement('td');
    detailsCell.colSpan = 3; // يجب أن يمتد على عدد الأعمدة المتبقية في الجدول الرئيسي
    detailsCell.style.padding = '10px';
    detailsCell.style.border = '1px solid #ddd';

    const detailsTable = document.createElement('table');
    detailsTable.style.width = '100%';
    detailsTable.style.borderCollapse = 'collapse';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['اسم المنتج', 'السعر', 'الكمية']; // تم حذف "الإجراءات" من رؤوس الجدول الفرعي
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        th.style.border = '1px solid #ddd';
        th.style.padding = '8px';
        th.style.textAlign = 'right';
        th.style.backgroundColor = '#f9f9f9';
        th.style.fontWeight = 'bold';
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    detailsTable.appendChild(thead);

    const tbody = document.createElement('tbody');
    record.items.forEach(item => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;
        nameCell.style.border = '1px solid #ddd';
        nameCell.style.padding = '8px';
        nameCell.style.textAlign = 'right';
        row.appendChild(nameCell);

        const priceCell = document.createElement('td');
        priceCell.textContent = item.price;
        priceCell.style.border = '1px solid #ddd';
        priceCell.style.padding = '8px';
        priceCell.style.textAlign = 'right';
        row.appendChild(priceCell);

        const quantityCell = document.createElement('td');
        quantityCell.textContent = item.quantity;
        quantityCell.style.border = '1px solid #ddd';
        quantityCell.style.padding = '8px';
        quantityCell.style.textAlign = 'right';
        row.appendChild(quantityCell);

        tbody.appendChild(row);
    });
    detailsTable.appendChild(tbody);
    detailsCell.appendChild(detailsTable);
    detailsRow.appendChild(detailsCell);

    mainRow.parentNode.insertBefore(detailsRow, mainRow.nextSibling);
}

function deleteReturnSaleItem(record, itemIndex, mainRow) {
    if (confirm('هل أنت متأكد أنك تريد حذف هذا المنتج من مرتجع المبيعات؟')) {
        record.items.splice(itemIndex, 1); // حذف المنتج من سجل مرتجع المبيعات
        showReturnSaleDetails(record, mainRow); // إعادة عرض جدول التفاصيل
        // يمكنك هنا إضافة منطق لتحديث المخزون (إضافة الكمية المرتجعة) أو حفظ التغييرات
    }
}

function deleteReturnSale(index) {
    const recordToDelete = returnSalesRecords[index];
    if (recordToDelete && confirm('هل أنت متأكد أنك تريد حذف هذا المرتجع وإعادة المنتجات إلى سجل المبيعات (افتراضيًا)؟')) {
        // **ملاحظة:** هنا تحتاج منطقًا أكثر دقة لتحديث سجل المبيعات الأصلي إذا لزم الأمر.
        // حاليًا، لن نقوم بتحديث سجل المبيعات الأصلي بشكل تلقائي.
        recordToDelete.items.forEach(item => {
            const inventoryIndex = inventory.findIndex(product => product.name === item.name);
            if (inventoryIndex !== -1) {
                inventory[inventoryIndex].quantity -= item.quantity; // نفترض أن الحذف يعني إزالة من المخزون إذا تمت إضافته عند الإرجاع.
            }
        });
        returnSalesRecords.splice(index, 1);
        showInventory();
        displayReturnSalesLog();
    }
}

document.getElementById('search-returns-sales-customer').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const filteredReturns = returnSalesRecords.filter(record =>
        record.customer.toLowerCase().includes(searchTerm)
    );
    displayFilteredReturnSalesLog(filteredReturns);
});

function displayFilteredReturnSalesLog(filteredRecords) {
    const returnSalesLogBody = document.getElementById('returns-sales-log-body');
    returnSalesLogBody.innerHTML = '';

    if (filteredRecords.length > 0) {
        filteredRecords.forEach((record, index) => {
            const originalIndex = returnSalesRecords.findIndex(r => r === record);
            const row = returnSalesLogBody.insertRow();

            const customerCell = row.insertCell();
            customerCell.textContent = record.customer;
            customerCell.style.border = '1px solid #ddd';
            customerCell.style.padding = '8px';
            customerCell.style.textAlign = 'right';

            const dateCell = row.insertCell();
            dateCell.textContent = record.date;
            dateCell.style.border = '1px solid #ddd';
            dateCell.style.padding = '8px';
            dateCell.style.textAlign = 'right';

            const actionsCell = row.insertCell();
            const detailsButton = document.createElement('button');
            detailsButton.textContent = 'عرض التفاصيل';
            detailsButton.onclick = () => showReturnSaleDetails(originalIndex);
            actionsCell.appendChild(detailsButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'حذف';
            deleteButton.onclick = () => deleteReturnSale(originalIndex);
            actionsCell.appendChild(deleteButton);
        });
    } else {
        const noRecordsMessage = document.createElement('tr');
        const cell = noRecordsMessage.insertCell();
        cell.textContent = 'لا توجد مرتجعات مبيعات تطابق معيار البحث.';
        cell.colSpan = 3;
        returnSalesLogBody.appendChild(noRecordsMessage);
    }
}

function addReturnInvoicesItem() {
    const nameInput = document.getElementById('returns-invoices-product-name');
    const quantityInput = document.getElementById('returns-invoices-product-quantity');
    const priceInput = document.getElementById('returns-invoices-product-price');

    const name = nameInput.value.trim();
    const quantity = parseInt(quantityInput.value);
    const price = parseFloat(priceInput.value);

    if (name && !isNaN(quantity) && quantity > 0) {
        const existingProductInInventory = inventory.find(product => product.name === name);
        if (existingProductInInventory) {
            const returnInvoicesItem = {
                name: name,
                quantity: quantity,
                price: isNaN(price) ? existingProductInInventory.price : price
            };
            currentReturnInvoicesItems.push(returnInvoicesItem);
            nameInput.value = '';
            quantityInput.value = '';
            priceInput.value = '';
            displayCurrentReturnInvoices();
        } else {
            alert('المنتج الذي أدخلته غير موجود في المخزون.');
        }
    } else {
        alert('الرجاء إدخال اسم المنتج والكمية بشكل صحيح (يجب أن تكون الكمية أكبر من 0).');
    }
}

function removeReturnInvoicesItem(productName) {
    currentReturnInvoicesItems = currentReturnInvoicesItems.filter(item => item.name !== productName);
    displayCurrentReturnInvoices();
}

function displayCurrentReturnInvoices() {
    const returnInvoicesBody = document.getElementById('returns-invoices-body');
    returnInvoicesBody.innerHTML = '';

    currentReturnInvoicesItems.forEach(item => {
        const row = returnInvoicesBody.insertRow();

        const nameCell = row.insertCell();
        nameCell.textContent = item.name;

        const quantityCell = row.insertCell();
        quantityCell.textContent = item.quantity;

        const priceCell = row.insertCell();
        priceCell.textContent = item.price;

        const actionsCell = row.insertCell();
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'حذف';
        deleteButton.onclick = () => removeReturnInvoicesItem(item.name);
        actionsCell.appendChild(deleteButton);
    });
}

function saveReturnInvoices() {
    if (currentReturnInvoicesItems.length > 0) {
        const customerNameInput = document.getElementById('returns-invoices-customer-name');
        const customerName = customerNameInput.value.trim();
        const invoiceNumberInput = document.getElementById('returns-invoices-invoice-number');
        const invoiceNumber = parseInt(invoiceNumberInput.value);
        const returnDate = new Date().toLocaleDateString();
        const returnedItems = [];
        let returnSuccessful = true;

        const invoiceRecordIndex = invoicesRecords.findIndex(
            record => record.invoiceNumber === invoiceNumber && record.customer === customerName
        );

        if (invoiceRecordIndex !== -1) {
            for (const returnItem of currentReturnInvoicesItems) {
                const invoicedItemIndex = invoicesRecords[invoiceRecordIndex].items.findIndex(
                    item => item.name === returnItem.name
                );

                if (invoicedItemIndex !== -1 && invoicesRecords[invoiceRecordIndex].items[invoicedItemIndex].quantity >= returnItem.quantity) {
                    invoicesRecords[invoiceRecordIndex].items[invoicedItemIndex].quantity -= returnItem.quantity;
                    const inventoryIndex = inventory.findIndex(product => product.name === returnItem.name);
                    if (inventoryIndex !== -1) {
                        inventory[inventoryIndex].quantity += returnItem.quantity;
                        returnedItems.push({
                            name: returnItem.name,
                            quantity: returnItem.quantity,
                            price: returnItem.price
                        });
                    } else {
                        alert(`خطأ: المنتج "${returnItem.name}" غير موجود في المخزون.`);
                        returnSuccessful = false;
                        break;
                    }
                } else {
                    alert(`الكمية المرتجعة من "<span class="math-inline">\{returnItem\.name\}" أكبر من الكمية الموجودة في الفاتورة رقم "</span>{invoiceNumber}" للعميل "${customerName}".`);
                    returnSuccessful = false;
                    break;
                }
            }

            if (returnSuccessful) {
                returnInvoicesRecords.push({
                    invoiceNumber: invoiceNumber,
                    customer: customerName,
                    date: returnDate,
                    items: returnedItems
                });
                currentReturnInvoicesItems = [];
                displayCurrentReturnInvoices();
                showInventory();
                alert(`تم تسجيل مرتجع الفاتورة رقم "${invoiceNumber}" بنجاح.`);
                if (document.getElementById('returns_invoices_log').style.display === 'block') {
                    displayReturnInvoicesLog();
                }
            }
        } else {
            alert(`لم يتم العثور على فاتورة رقم "<span class="math-inline">\{invoiceNumber\}" للعميل "</span>{customerName}".`);
        }
    } else {
        alert('لا يوجد منتجات في قائمة المرتجع لحفظها.');
    }
}
function displayReturnInvoicesLog() {
    const returnInvoicesLogBody = document.getElementById('returns-invoices-log-body');
    returnInvoicesLogBody.innerHTML = '';

    if (returnInvoicesRecords.length > 0) {
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.marginTop = '10px';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['رقم الفاتورة المرجعة', 'اسم العميل', 'تاريخ المرتجع', 'العمليات'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            th.style.border = '1px solid #ddd';
            th.style.padding = '8px';
            th.style.textAlign = 'right';
            th.style.backgroundColor = '#f2f2f2';
            th.style.fontWeight = 'bold';
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        returnInvoicesRecords.forEach((record, index) => {
            const row = document.createElement('tr');
            row.dataset.invoiceNumber = record.invoiceNumber;

            const invoiceNumberCell = document.createElement('td');
            invoiceNumberCell.textContent = record.invoiceNumber;
            invoiceNumberCell.style.border = '1px solid #ddd';
            invoiceNumberCell.style.padding = '8px';
            invoiceNumberCell.style.textAlign = 'right';
            row.appendChild(invoiceNumberCell);

            const customerCell = document.createElement('td');
            customerCell.textContent = record.customer;
            customerCell.style.border = '1px solid #ddd';
            customerCell.style.padding = '8px';
            customerCell.style.textAlign = 'right';
            row.appendChild(customerCell);

            const dateCell = document.createElement('td');
            dateCell.textContent = record.date;
            dateCell.style.border = '1px solid #ddd';
            dateCell.style.padding = '8px';
            dateCell.style.textAlign = 'right';
            row.appendChild(dateCell);

            const actionsCell = document.createElement('td');
            const printButton = document.createElement('button');
            printButton.textContent = 'طباعة';
            printButton.onclick = () => printReturnInvoice(record); // وظيفة الطباعة لمرتجع الفواتير
            actionsCell.appendChild(printButton);

            const detailsButton = document.createElement('button');
            detailsButton.textContent = 'عرض التفاصيل';
            detailsButton.onclick = () => showReturnInvoiceDetails(record, row);
            actionsCell.appendChild(detailsButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'حذف';
            deleteButton.onclick = () => deleteReturnInvoice(record);
            actionsCell.appendChild(deleteButton);

            actionsCell.style.border = '1px solid #ddd';
            actionsCell.style.padding = '8px';
            actionsCell.style.textAlign = 'right';

            row.appendChild(actionsCell);
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        returnInvoicesLogBody.appendChild(table);
    } else {
        const noRecordsMessage = document.createElement('p');
        noRecordsMessage.textContent = 'لا يوجد مرتجعات فواتير مسجلة.';
        returnInvoicesLogBody.appendChild(noRecordsMessage);
    }
}

function printReturnInvoice(invoiceData) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>طباعة مرتجع الفاتورة رقم: ${invoiceData.invoiceNumber}</title>
            <style>
                body { font-family: Arial, sans-serif; direction: rtl; }
                h1 { text-align: center; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <h1>مؤسسة كيرو للأدوات الصحية</h1>
            <h2>مرتجع فاتورة رقم: ${invoiceData.invoiceNumber}</h2>
            <p>اسم العميل: ${invoiceData.customer}</p>
            <p>تاريخ المرتجع: ${invoiceData.date}</p>
            <table>
                <thead>
                    <tr>
                        <th>اسم المنتج</th>
                        <th>السعر</th>
                        <th>الكمية المرتجعة</th>
                    </tr>
                </thead>
                <tbody>
                    ${invoiceData.items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.price}</td>
                            <td>${item.quantity}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <button onclick="window.print()">طباعة</button>
        </body>
        </html>
    `);
    printWindow.document.close();
}

function showReturnInvoiceDetails(record, mainRow) {
    // التحقق إذا كان جدول التفاصيل معروضًا بالفعل لهذا الصف
    const existingDetailsRow = mainRow.nextElementSibling;
    if (existingDetailsRow && existingDetailsRow.classList.contains('details-row')) {
        existingDetailsRow.remove(); // إخفاء التفاصيل إذا كانت معروضة
        return;
    }

    const detailsRow = document.createElement('tr');
    detailsRow.classList.add('details-row');
    const detailsCell = document.createElement('td');
    detailsCell.colSpan = 4; // يجب أن يمتد على عدد أعمدة الجدول الرئيسي
    detailsCell.style.padding = '10px';
    detailsCell.style.border = '1px solid #ddd';

    const detailsTable = document.createElement('table');
    detailsTable.style.width = '100%';
    detailsTable.style.borderCollapse = 'collapse';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['اسم المنتج', 'السعر', 'الكمية'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        th.style.border = '1px solid #ddd';
        th.style.padding = '8px';
        th.style.textAlign = 'right';
        th.style.backgroundColor = '#f9f9f9';
        th.style.fontWeight = 'bold';
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    detailsTable.appendChild(thead);

    const tbody = document.createElement('tbody');
    record.items.forEach(item => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;
        nameCell.style.border = '1px solid #ddd';
        nameCell.style.padding = '8px';
        nameCell.style.textAlign = 'right';
        row.appendChild(nameCell);

        const priceCell = document.createElement('td');
        priceCell.textContent = item.price;
        priceCell.style.border = '1px solid #ddd';
        priceCell.style.padding = '8px';
        priceCell.style.textAlign = 'right';
        row.appendChild(priceCell);

        const quantityCell = document.createElement('td');
        quantityCell.textContent = item.quantity;
        quantityCell.style.border = '1px solid #ddd';
        quantityCell.style.padding = '8px';
        quantityCell.style.textAlign = 'right';
        row.appendChild(quantityCell);

        tbody.appendChild(row);
    });
    detailsTable.appendChild(tbody);
    detailsCell.appendChild(detailsTable);
    detailsRow.appendChild(detailsCell);

    mainRow.parentNode.insertBefore(detailsRow, mainRow.nextSibling);
}
function deleteReturnInvoice(recordToDelete) {
    if (recordToDelete && confirm(`هل أنت متأكد أنك تريد حذف مرتجع الفاتورة رقم "${recordToDelete.invoiceNumber}"؟`)) {
        const index = returnInvoicesRecords.findIndex(record => record === recordToDelete);
        if (index !== -1) {
            returnInvoicesRecords.splice(index, 1);
            displayReturnInvoicesLog();
        }
    }
}

document.getElementById('search-returns-invoices-customer').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase().trim();
    const filteredReturns = returnInvoicesRecords.filter(record =>
        record.customer.toLowerCase().includes(searchTerm)
    );
    displayFilteredReturnInvoicesLog(filteredReturns);
});

function displayFilteredReturnInvoicesLog(filteredRecords) {
    const returnInvoicesLogBody = document.getElementById('returns-invoices-log-body');
    returnInvoicesLogBody.innerHTML = '';

    if (filteredRecords.length > 0) {
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.marginTop = '10px';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['رقم الفاتورة المرجعة', 'اسم العميل', 'تاريخ المرتجع', 'المنتجات المرتجعة', 'الإجراءات'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            th.style.border = '1px solid #ddd';
            th.style.padding = '8px';
            th.style.textAlign = 'right';
            th.style.backgroundColor = '#f2f2f2';
            th.style.fontWeight = 'bold';
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        filteredRecords.forEach(record => {
            const row = document.createElement('tr');

            const invoiceNumberCell = document.createElement('td');
            invoiceNumberCell.textContent = record.invoiceNumber;
            invoiceNumberCell.style.border = '1px solid #ddd';
            invoiceNumberCell.style.padding = '8px';
            invoiceNumberCell.style.textAlign = 'right';
            row.appendChild(invoiceNumberCell);

            const customerCell = document.createElement('td');
            customerCell.textContent = record.customer;
            customerCell.style.border = '1px solid #ddd';
            customerCell.style.padding = '8px';
            customerCell.style.textAlign = 'right';
            row.appendChild(customerCell);

            const dateCell = document.createElement('td');
            dateCell.textContent = record.date;
            dateCell.style.border = '1px solid #ddd';
            dateCell.style.padding = '8px';
            dateCell.style.textAlign = 'right';
            row.appendChild(dateCell);

            const productsCell = document.createElement('td');
            let productsList = '';
            record.items.forEach(item => {
                productsList += `<span class="math-inline">\{item\.name\} \(</span>{item.quantity} × ${item.price}), `;
            });
            if (productsList.endsWith(', ')) {
                productsList = productsList.slice(0, -2);
            }
            productsCell.textContent = productsList;
            productsCell.style.border = '1px solid #ddd';
            productsCell.style.padding = '8px';
            productsCell.style.textAlign = 'right';
            row.appendChild(productsCell);

            const actionsCell = document.createElement('td');
            const detailsButton = document.createElement('button');
            detailsButton.textContent = 'عرض التفاصيل';
            detailsButton.onclick = () => showReturnInvoiceDetails(record);
            actionsCell.appendChild(detailsButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'حذف';
            deleteButton.onclick = () => deleteReturnInvoice(record);
            actionsCell.appendChild(deleteButton);

            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        returnInvoicesLogBody.appendChild(table);
    } else {
        const noRecordsMessage = document.createElement('p');
        noRecordsMessage.textContent = 'لا توجد مرتجعات فواتير تطابق معيار البحث.';
        returnInvoicesLogBody.appendChild(noRecordsMessage);
    }
}

function displaySalesLog() {
    const salesLogBody = document.getElementById('sales-log-body');
    salesLogBody.innerHTML = '';

    if (salesRecords.length > 0) {
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.marginTop = '10px';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['رقم العملية', 'اسم العميل', 'تاريخ البيع', 'العمليات'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            th.style.border = '1px solid #ddd';
            th.style.padding = '8px';
            th.style.textAlign = 'right';
            th.style.backgroundColor = '#f2f2f2';
            th.style.fontWeight = 'bold';
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        salesRecords.forEach((record, index) => {
            const row = document.createElement('tr');
            row.dataset.saleIndex = index; // لتحديد الصف بسهولة لاحقًا

            const saleIndexCell = document.createElement('td');
            saleIndexCell.textContent = index + 1; // أو يمكنك استخدام معرف فريد إذا كان لديك
            saleIndexCell.style.border = '1px solid #ddd';
            saleIndexCell.style.padding = '8px';
            saleIndexCell.style.textAlign = 'right';
            row.appendChild(saleIndexCell);

            const customerCell = document.createElement('td');
            customerCell.textContent = record.customer;
            customerCell.style.border = '1px solid #ddd';
            customerCell.style.padding = '8px';
            customerCell.style.textAlign = 'right';
            row.appendChild(customerCell);

            const dateCell = document.createElement('td');
            dateCell.textContent = record.date;
            dateCell.style.border = '1px solid #ddd';
            dateCell.style.padding = '8px';
            dateCell.style.textAlign = 'right';
            row.appendChild(dateCell);

            const actionsCell = document.createElement('td');
            const detailsButton = document.createElement('button');
            detailsButton.textContent = 'عرض التفاصيل';
            detailsButton.onclick = () => showSaleDetails(record, row); // تمرير السجل والصف الحالي
            actionsCell.appendChild(detailsButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'حذف';
            deleteButton.onclick = () => deleteSale(index);
            actionsCell.appendChild(deleteButton);
            actionsCell.style.border = '1px solid #ddd';
            actionsCell.style.padding = '8px';
            actionsCell.style.textAlign = 'right';

            row.appendChild(actionsCell);
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        salesLogBody.appendChild(table);
    } else {
        const noRecordsMessage = document.createElement('p');
        noRecordsMessage.textContent = 'لا يوجد مبيعات مسجلة.';
        salesLogBody.appendChild(noRecordsMessage);
    }
}

function showSaleDetails(record, mainRow) {
    // التحقق إذا كان جدول التفاصيل معروضًا بالفعل لهذا الصف
    const existingDetailsRow = mainRow.nextElementSibling;
    if (existingDetailsRow && existingDetailsRow.classList.contains('details-row')) {
        existingDetailsRow.remove(); // إخفاء التفاصيل إذا كانت معروضة
        return;
    }

    const detailsRow = document.createElement('tr');
    detailsRow.classList.add('details-row');
    const detailsCell = document.createElement('td');
    detailsCell.colSpan = 4; // يجب أن يمتد على عدد أعمدة الجدول الرئيسي
    detailsCell.style.padding = '10px';
    detailsCell.style.border = '1px solid #ddd';

    const detailsTable = document.createElement('table');
    detailsTable.style.width = '100%';
    detailsTable.style.borderCollapse = 'collapse';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['اسم المنتج', 'السعر', 'الكمية'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        th.style.border = '1px solid #ddd';
        th.style.padding = '8px';
        th.style.textAlign = 'right';
        th.style.backgroundColor = '#f9f9f9';
        th.style.fontWeight = 'bold';
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    detailsTable.appendChild(thead);

    const tbody = document.createElement('tbody');
    record.items.forEach(item => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;
        nameCell.style.border = '1px solid #ddd';
        nameCell.style.padding = '8px';
        nameCell.style.textAlign = 'right';
        row.appendChild(nameCell);

        const priceCell = document.createElement('td');
        priceCell.textContent = item.price;
        priceCell.style.border = '1px solid #ddd';
        priceCell.style.padding = '8px';
        priceCell.style.textAlign = 'right';
        row.appendChild(priceCell);

        const quantityCell = document.createElement('td');
        quantityCell.textContent = item.quantity;
        quantityCell.style.border = '1px solid #ddd';
        quantityCell.style.padding = '8px';
        quantityCell.style.textAlign = 'right';
        row.appendChild(quantityCell);

        tbody.appendChild(row);
    });
    detailsTable.appendChild(tbody);
    detailsCell.appendChild(detailsTable);
    detailsRow.appendChild(detailsCell);

    mainRow.parentNode.insertBefore(detailsRow, mainRow.nextSibling);
}

function deleteSale(index) {
    const recordToDelete = salesRecords[index];
    if (recordToDelete && confirm('هل أنت متأكد أنك تريد حذف عملية البيع هذه وإرجاع المنتجات إلى المخزون؟')) {
        recordToDelete.items.forEach(item => {
            const inventoryIndex = inventory.findIndex(product => product.name === item.name);
            if (inventoryIndex !== -1) {
                inventory[inventoryIndex].quantity += item.quantity;
            }
        });
        salesRecords.splice(index, 1);
        showInventory(); // تحديث عرض المخزون
        displaySalesLog(); // تحديث جدول سجل المبيعات
    }
}

document.getElementById('search-sales-customer').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const filteredSales = salesRecords.filter(record =>
        record.customer.toLowerCase().includes(searchTerm)
    );
    displayFilteredSalesLog(filteredSales);
});

function displayFilteredSalesLog(filteredRecords) {
    const salesLogBody = document.getElementById('sales-log-body');
    salesLogBody.innerHTML = ''; // مسح المحتوى السابق

    if (filteredRecords.length > 0) {
        filteredRecords.forEach((record, index) => {
            const originalIndex = salesRecords.findIndex(r => r === record); // للحصول على الفهرس الأصلي للحذف
            const row = salesLogBody.insertRow();

            const customerCell = row.insertCell();
            customerCell.textContent = record.customer;
            customerCell.style.border = '1px solid #ddd';
            customerCell.style.padding = '8px';
            customerCell.style.textAlign = 'right';

            const dateCell = row.insertCell();
            dateCell.textContent = record.date;
            dateCell.style.border = '1px solid #ddd';
            dateCell.style.padding = '8px';
            dateCell.style.textAlign = 'right';

            const actionsCell = row.insertCell();
            const detailsButton = document.createElement('button');
            detailsButton.textContent = 'عرض التفاصيل';
            detailsButton.onclick = () => showSaleDetails(salesRecords.findIndex(r => r === record)); // استخدام الفهرس الأصلي
            actionsCell.appendChild(detailsButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'حذف';
            deleteButton.onclick = () => deleteSale(salesRecords.findIndex(r => r === record)); // استخدام الفهرس الأصلي
            actionsCell.appendChild(deleteButton);
        });
    } else {
        const noRecordsMessage = document.createElement('tr');
        const cell = noRecordsMessage.insertCell();
        cell.textContent = 'لا توجد مبيعات تطابق معيار البحث.';
        cell.colSpan = 3;
        salesLogBody.appendChild(noRecordsMessage);
    }
}

function displayInvoicesLog() {
    const invoicesLogBody = document.getElementById('invoices-log-body');
    invoicesLogBody.innerHTML = '';

    if (invoicesRecords.length > 0) {
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.marginTop = '10px';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['رقم الفاتورة', 'اسم العميل', 'تاريخ الإصدار', 'العمليات'];
      const actionsCell = document.createElement('td');
    const printButton = document.createElement('button');
    printButton.textContent = 'طباعة';
    printButton.onclick = () => printInvoice(record); // تمرير بيانات الفاتورة الحالية
    actionsCell.appendChild(printButton);
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            th.style.border = '1px solid #ddd';
            th.style.padding = '8px';
            th.style.textAlign = 'right';
            th.style.backgroundColor = '#f2f2f2';
            th.style.fontWeight = 'bold';
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        invoicesRecords.forEach((record, index) => {
            const row = document.createElement('tr');
            row.dataset.invoiceIndex = index; // لتحديد الصف بسهولة لاحقًا

            const invoiceNumberCell = document.createElement('td');
            invoiceNumberCell.textContent = record.invoiceNumber;
            invoiceNumberCell.style.border = '1px solid #ddd';
            invoiceNumberCell.style.padding = '8px';
            invoiceNumberCell.style.textAlign = 'right';
            row.appendChild(invoiceNumberCell);

            const customerCell = document.createElement('td');
            customerCell.textContent = record.customer;
            customerCell.style.border = '1px solid #ddd';
            customerCell.style.padding = '8px';
            customerCell.style.textAlign = 'right';
            row.appendChild(customerCell);

            const dateCell = document.createElement('td');
            dateCell.textContent = record.date;
            dateCell.style.border = '1px solid #ddd';
            dateCell.style.padding = '8px';
            dateCell.style.textAlign = 'right';
            row.appendChild(dateCell);

            const actionsCell = document.createElement('td');
            const printButton = document.createElement('button');
            printButton.textContent = 'طباعة';
            printButton.onclick = () => printInvoice(record); // وظيفة الطباعة
            actionsCell.appendChild(printButton);

            const detailsButton = document.createElement('button');
            detailsButton.textContent = 'عرض التفاصيل';
            detailsButton.onclick = () => showInvoiceDetails(record, row);
            actionsCell.appendChild(detailsButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'حذف الفاتورة';
            deleteButton.onclick = () => deleteInvoice(index);
            actionsCell.appendChild(deleteButton);

            actionsCell.style.border = '1px solid #ddd';
            actionsCell.style.padding = '8px';
            actionsCell.style.textAlign = 'right';

            row.appendChild(actionsCell);
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        invoicesLogBody.appendChild(table);
    } else {
        const noRecordsMessage = document.createElement('p');
        noRecordsMessage.textContent = 'لا توجد فواتير محفوظة.';
        invoicesLogBody.appendChild(noRecordsMessage);
    }
}

function printInvoice(invoiceData) {
    if (!invoiceData) {
        console.error("خطأ: بيانات الفاتورة غير متوفرة للطباعة.");
        alert("لا توجد بيانات فاتورة للطباعة.");
        return;
    }

    const printWindowContent = `
        <html>
        <head>
            <title>طباعة الفاتورة رقم: ${invoiceData.invoiceNumber}</title>
            <style>
                body { font-family: Arial, sans-serif; direction: rtl; }
                h1 { text-align: center; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <h1>مؤسسة كيرو للأدوات الصحية</h1>
            <h2>فاتورة رقم: ${invoiceData.invoiceNumber}</h2>
            <p>اسم العميل: ${invoiceData.customer}</p>
            <p>تاريخ الإصدار: ${invoiceData.date}</p>
            <table>
                <thead>
                    <tr>
                        <th>اسم المنتج</th>
                        <th>السعر</th>
                        <th>الكمية</th>
                        <th>الإجمالي</th>
                    </tr>
                </thead>
                <tbody>
                    ${invoiceData.items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.price}</td>
                            <td>${item.quantity}</td>
                            <td>${item.price * item.quantity}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </body>
        </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printWindowContent);
    printWindow.document.close();
    printWindow.print(); // أمر الطباعة المباشر
}

function showInvoiceDetails(record, mainRow) {
    // التحقق إذا كان جدول التفاصيل معروضًا بالفعل لهذا الصف
    const existingDetailsRow = mainRow.nextElementSibling;
    if (existingDetailsRow && existingDetailsRow.classList.contains('details-row')) {
        existingDetailsRow.remove(); // إخفاء التفاصيل إذا كانت معروضة
        return;
    }

    const detailsRow = document.createElement('tr');
    detailsRow.classList.add('details-row');
    const detailsCell = document.createElement('td');
    detailsCell.colSpan = 3; // يجب أن يمتد على عدد الأعمدة المتبقية في الجدول الرئيسي
    detailsCell.style.padding = '10px';
    detailsCell.style.border = '1px solid #ddd';

    const detailsTable = document.createElement('table');
    detailsTable.style.width = '100%';
    detailsTable.style.borderCollapse = 'collapse';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['اسم المنتج', 'السعر', 'الكمية']; // تم حذف "الإجراءات" من رؤوس الجدول الفرعي
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        th.style.border = '1px solid #ddd';
        th.style.padding = '8px';
        th.style.textAlign = 'right';
        th.style.backgroundColor = '#f9f9f9';
        th.style.fontWeight = 'bold';
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    detailsTable.appendChild(thead);

    const tbody = document.createElement('tbody');
    record.items.forEach(item => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;
        nameCell.style.border = '1px solid #ddd';
        nameCell.style.padding = '8px';
        nameCell.style.textAlign = 'right';
        row.appendChild(nameCell);

        const priceCell = document.createElement('td');
        priceCell.textContent = item.price;
        priceCell.style.border = '1px solid #ddd';
        priceCell.style.padding = '8px';
        priceCell.style.textAlign = 'right';
        row.appendChild(priceCell);

        const quantityCell = document.createElement('td');
        quantityCell.textContent = item.quantity;
        quantityCell.style.border = '1px solid #ddd';
        quantityCell.style.padding = '8px';
        quantityCell.style.textAlign = 'right';
        row.appendChild(quantityCell);

        tbody.appendChild(row);
    });
    detailsTable.appendChild(tbody);
    detailsCell.appendChild(detailsTable);
    detailsRow.appendChild(detailsCell);

    mainRow.parentNode.insertBefore(detailsRow, mainRow.nextSibling);
}

function deleteInvoiceItemFromDetails(record, itemIndex, mainRow) {
    if (confirm('هل أنت متأكد أنك تريد حذف هذا المنتج من الفاتورة؟')) {
        record.items.splice(itemIndex, 1); // حذف المنتج من سجل الفواتير
        showInvoiceDetails(record, mainRow); // إعادة عرض جدول التفاصيل
        // يمكنك هنا استدعاء وظيفة أخرى لتحديث المخزون أو حفظ التغييرات
    }
}

function deleteInvoice(index) {
    const recordToDelete = invoicesRecords[index];
    if (recordToDelete && confirm('هل أنت متأكد أنك تريد حذف هذه الفاتورة وإرجاع المنتجات إلى المخزون؟')) {
        recordToDelete.items.forEach(item => {
            const inventoryIndex = inventory.findIndex(product => product.name === item.name);
            if (inventoryIndex !== -1) {
                inventory[inventoryIndex].quantity += item.quantity;
            }
        });
        invoicesRecords.splice(index, 1);
        showInventory(); // تحديث عرض المخزون
        displayInvoicesLog(); // تحديث جدول سجل الفواتير
    }
}

document.getElementById('search-invoices').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase().trim();
    const filteredInvoices = invoicesRecords.filter(record =>
        record.customer.toLowerCase().includes(searchTerm) || record.invoiceNumber.toString().includes(searchTerm)
    );
    displayFilteredInvoicesLog(filteredInvoices);
});

function displayFilteredInvoicesLog(filteredRecords) {
    const invoicesLogBody = document.getElementById('invoices-log-body');
    invoicesLogBody.innerHTML = ''; // مسح الجدول الحالي

    if (filteredRecords.length > 0) {
        filteredRecords.forEach((record, index) => {
            const originalIndex = invoicesRecords.findIndex(r => r === record); // للحصول على الفهرس الأصلي للحذف
            const row = invoicesLogBody.insertRow();

            const invoiceNumberCell = row.insertCell();
            invoiceNumberCell.textContent = record.invoiceNumber;
            invoiceNumberCell.style.border = '1px solid #ddd';
            invoiceNumberCell.style.padding = '8px';
            invoiceNumberCell.style.textAlign = 'right';

            const customerCell = row.insertCell();
            customerCell.textContent = record.customer;
            customerCell.style.border = '1px solid #ddd';
            customerCell.style.padding = '8px';
            customerCell.style.textAlign = 'right';

            const dateCell = row.insertCell();
            dateCell.textContent = record.date;
            dateCell.style.border = '1px solid #ddd';
            dateCell.style.padding = '8px';
            dateCell.style.textAlign = 'right';

            const actionsCell = row.insertCell();
            const detailsButton = document.createElement('button');
            detailsButton.textContent = 'عرض التفاصيل';
            detailsButton.onclick = () => showInvoiceDetails(originalIndex);
            actionsCell.appendChild(detailsButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'حذف';
            deleteButton.onclick = () => deleteInvoice(originalIndex);
            actionsCell.appendChild(deleteButton);
        });
    } else {
        const noRecordsMessage = document.createElement('tr');
        const cell = noRecordsMessage.insertCell();
        cell.textContent = 'لا توجد فواتير تطابق معيار البحث.';
        cell.colSpan = 4;
        invoicesLogBody.appendChild(noRecordsMessage);
    }
}

function displayArchivedInvoices() {
    const archivedInvoicesBody = document.getElementById('archived-invoices-body');
    archivedInvoicesBody.innerHTML = '';

    if (archivedInvoices.length > 0) {
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.marginTop = '10px';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['رقم الفاتورة', 'اسم العميل', 'تاريخ الأرشفة', 'العمليات']; // لا يزال لدينا عمود العمليات للأزرار الجديدة
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            th.style.border = '1px solid #ddd';
            th.style.padding = '8px';
            th.style.textAlign = 'right';
            th.style.backgroundColor = '#f2f2f2';
            th.style.fontWeight = 'bold';
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        archivedInvoices.forEach((record, index) => {
            const row = document.createElement('tr');
            row.dataset.archiveIndex = index; // لتحديد الصف بسهولة لاحقًا

            const invoiceNumberCell = document.createElement('td');
            invoiceNumberCell.textContent = record.invoiceNumber;
            invoiceNumberCell.style.border = '1px solid #ddd';
            invoiceNumberCell.style.padding = '8px';
            invoiceNumberCell.style.textAlign = 'right';
            row.appendChild(invoiceNumberCell);

            const customerCell = document.createElement('td');
            customerCell.textContent = record.customer;
            customerCell.style.border = '1px solid #ddd';
            customerCell.style.padding = '8px';
            customerCell.style.textAlign = 'right';
            row.appendChild(customerCell);

            const dateCell = document.createElement('td');
            dateCell.textContent = record.date;
            dateCell.style.border = '1px solid #ddd';
            dateCell.style.padding = '8px';
            dateCell.style.textAlign = 'right';
            row.appendChild(dateCell);

            const actionsCell = document.createElement('td');
            const detailsButton = document.createElement('button');
            detailsButton.textContent = 'عرض التفاصيل';
            detailsButton.onclick = () => showArchivedInvoiceDetails(record, row); // تمرير السجل والصف الحالي
            actionsCell.appendChild(detailsButton);

            const deleteInvoiceButton = document.createElement('button');
            deleteInvoiceButton.textContent = 'حذف الفاتورة';
            deleteInvoiceButton.onclick = () => deleteArchivedInvoice(record, index); // وظيفة حذف الفاتورة من الأرشيف
            actionsCell.appendChild(deleteInvoiceButton);

            const moveInvoiceButton = document.createElement('button');
            moveInvoiceButton.textContent = 'نقل إلى سجل الفواتير';
            moveInvoiceButton.onclick = () => moveArchivedInvoiceToInvoices(record, index); // وظيفة نقل الفاتورة
            actionsCell.appendChild(moveInvoiceButton);

            actionsCell.style.border = '1px solid #ddd';
            actionsCell.style.padding = '8px';
            actionsCell.style.textAlign = 'right';

            row.appendChild(actionsCell);
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        archivedInvoicesBody.appendChild(table);
    } else {
        const noRecordsMessage = document.createElement('p');
        noRecordsMessage.textContent = 'لا توجد فواتير مؤرشفة.';
        archivedInvoicesBody.appendChild(noRecordsMessage);
    }
}

function deleteArchivedInvoice(record, index) {
    if (confirm('هل أنت متأكد أنك تريد حذف هذه الفاتورة نهائيًا من الأرشيف؟')) {
        archivedInvoices.splice(index, 1);
        displayArchivedInvoices(); // تحديث عرض الأرشيف
        // يمكنك هنا إضافة منطق لحفظ التغييرات في الأرشيف
    }
}

function moveArchivedInvoiceToInvoices(record, index) {
    if (confirm('هل أنت متأكد أنك تريد نقل هذه الفاتورة إلى سجل الفواتير وخصم المنتجات من المخزون؟')) {
        archivedInvoices.splice(index, 1); // إزالة الفاتورة من الأرشيف
        record.items.forEach(itemToMove => {
            // إضافة المنتج إلى سجل الفواتير
            const existingInvoice = invoicesRecords.find(inv => inv.invoiceNumber === record.invoiceNumber);
            if (existingInvoice) {
                existingInvoice.items.push(itemToMove);
            } else {
                invoicesRecords.push({ invoiceNumber: record.invoiceNumber, customer: record.customer, date: new Date().toLocaleDateString(), items: [itemToMove] });
            }

            // خصم المنتج من المخزون
            const inventoryIndex = inventory.findIndex(product => product.name === itemToMove.name);
            if (inventoryIndex !== -1 && inventory[inventoryIndex].quantity >= itemToMove.quantity) {
                inventory[inventoryIndex].quantity -= itemToMove.quantity;
                showInventory(); // تحديث عرض المخزون
            } else {
                alert(`تحذير: لا يوجد كمية كافية من منتج "${itemToMove.name}" في المخزون.`);
                // قد تحتاج إلى منطق إضافي هنا للتعامل مع نقص المخزون
            }
        });
        displayArchivedInvoices(); // تحديث عرض الأرشيف
        displayInvoicesLog(); // تحديث عرض سجل الفواتير
        // يمكنك هنا إضافة منطق لحفظ التغييرات في الأرشيف وسجل الفواتير
    }
}

function showArchivedInvoiceDetails(record, mainRow) {
    // التحقق إذا كان جدول التفاصيل معروضًا بالفعل لهذا الصف
    const existingDetailsRow = mainRow.nextElementSibling;
    if (existingDetailsRow && existingDetailsRow.classList.contains('details-row')) {
        existingDetailsRow.remove(); // إخفاء التفاصيل إذا كانت معروضة
        return;
    }

    const detailsRow = document.createElement('tr');
    detailsRow.classList.add('details-row');
    const detailsCell = document.createElement('td');
    detailsCell.colSpan = 4; // يجب أن يمتد على عدد أعمدة الجدول الرئيسي
    detailsCell.style.padding = '10px';
    detailsCell.style.border = '1px solid #ddd';

    const detailsTable = document.createElement('table');
    detailsTable.style.width = '100%';
    detailsTable.style.borderCollapse = 'collapse';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['اسم المنتج', 'السعر', 'الكمية']; // تم حذف عمود الإجراءات
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        th.style.border = '1px solid #ddd';
        th.style.padding = '8px';
        th.style.textAlign = 'right';
        th.style.backgroundColor = '#f9f9f9';
        th.style.fontWeight = 'bold';
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    detailsTable.appendChild(thead);

    const tbody = document.createElement('tbody');
    record.items.forEach(item => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;
        nameCell.style.border = '1px solid #ddd';
        nameCell.style.padding = '8px';
        nameCell.style.textAlign = 'right';
        row.appendChild(nameCell);

        const priceCell = document.createElement('td');
        priceCell.textContent = item.price;
        priceCell.style.border = '1px solid #ddd';
        priceCell.style.padding = '8px';
        priceCell.style.textAlign = 'right';
        row.appendChild(priceCell);

        const quantityCell = document.createElement('td');
        quantityCell.textContent = item.quantity;
        quantityCell.style.border = '1px solid #ddd';
        quantityCell.style.padding = '8px';
        quantityCell.style.textAlign = 'right';
        row.appendChild(quantityCell);

        tbody.appendChild(row);
    });
    detailsTable.appendChild(tbody);
    detailsCell.appendChild(detailsTable);
    detailsRow.appendChild(detailsCell);

    mainRow.parentNode.insertBefore(detailsRow, mainRow.nextSibling);
}

function deleteArchivedInvoiceItem(record, itemIndex, mainRow) {
    if (confirm('هل أنت متأكد أنك تريد حذف هذا المنتج نهائيًا من الأرشيف؟')) {
        record.items.splice(itemIndex, 1); // حذف المنتج من سجل الأرشيف
        showArchivedInvoiceDetails(record, mainRow); // إعادة عرض جدول التفاصيل
        // يمكنك هنا إضافة منطق لحفظ التغييرات في الأرشيف
    }
}

function moveArchivedInvoiceItemToInvoices(record, itemIndex, mainRow) {
    if (confirm('هل أنت متأكد أنك تريد نقل هذا المنتج إلى سجل الفواتير وخصمه من المخزون؟')) {
        const itemToMove = record.items.splice(itemIndex, 1)[0]; // إزالة المنتج من الأرشيف

        // إضافة المنتج إلى سجل الفواتير (تحتاج إلى التأكد من هيكل invoicesRecords)
        const existingInvoice = invoicesRecords.find(inv => inv.invoiceNumber === record.invoiceNumber);
        if (existingInvoice) {
            existingInvoice.items.push(itemToMove);
        } else {
            invoicesRecords.push({ invoiceNumber: record.invoiceNumber, customer: record.customer, date: new Date().toLocaleDateString(), items: [itemToMove] });
        }

        // خصم المنتج من المخزون
        const inventoryIndex = inventory.findIndex(product => product.name === itemToMove.name);
        if (inventoryIndex !== -1 && inventory[inventoryIndex].quantity >= itemToMove.quantity) {
            inventory[inventoryIndex].quantity -= itemToMove.quantity;
            showInventory(); // تحديث عرض المخزون
        } else {
            alert(`تحذير: لا يوجد كمية كافية من منتج "${itemToMove.name}" في المخزون.`);
            // قد تحتاج إلى منطق إضافي هنا للتعامل مع نقص المخزون
        }

        showArchivedInvoiceDetails(record, mainRow); // إعادة عرض جدول التفاصيل بعد النقل
        displayInvoicesLog(); // تحديث عرض سجل الفواتير
        // يمكنك هنا إضافة منطق لحفظ التغييرات في الأرشيف وسجل الفواتير
    }
}
function deleteArchivedInvoice(index) {
    if (confirm('هل أنت متأكد أنك تريد حذف هذه الفاتورة المؤرشفة؟ لن يؤثر هذا على المخزون.')) {
        archivedInvoices.splice(index, 1);
        displayArchivedInvoices(); // تحديث جدول الأرشيف
    }
}

document.getElementById('search-archived-invoices-customer').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase().trim();
    const filteredArchivedInvoices = archivedInvoices.filter(record =>
        record.customer.toLowerCase().includes(searchTerm)
    );
    displayFilteredArchivedInvoicesLog(filteredArchivedInvoices);
});

function displayFilteredArchivedInvoicesLog(filteredRecords) {
    const archivedInvoicesBody = document.getElementById('archived-invoices-body');
    archivedInvoicesBody.innerHTML = ''; // مسح الجدول الحالي

    if (filteredRecords.length > 0) {
        filteredRecords.forEach((record, index) => {
            const originalIndex = archivedInvoices.findIndex(r => r === record);
            const row = archivedInvoicesBody.insertRow();

            const invoiceNumberCell = row.insertCell();
            invoiceNumberCell.textContent = record.invoiceNumber;
            invoiceNumberCell.style.border = '1px solid #ddd';
            invoiceNumberCell.style.padding = '8px';
            invoiceNumberCell.style.textAlign = 'right';

            const customerCell = row.insertCell();
            customerCell.textContent = record.customer;
            customerCell.style.border = '1px solid #ddd';
            customerCell.style.padding = '8px';
            customerCell.style.textAlign = 'right';

            const dateCell = row.insertCell();
            dateCell.textContent = record.date;
            dateCell.style.border = '1px solid #ddd';
            dateCell.style.padding = '8px';
            dateCell.style.textAlign = 'right';

            const actionsCell = row.insertCell();
            const detailsButton = document.createElement('button');
            detailsButton.textContent = 'عرض التفاصيل';
            detailsButton.onclick = () => showArchivedInvoiceDetails(originalIndex);
            actionsCell.appendChild(detailsButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'حذف';
            deleteButton.onclick = () => deleteArchivedInvoice(originalIndex);
            actionsCell.appendChild(deleteButton);
        });
    } else {
        const noRecordsMessage = document.createElement('tr');
        const cell = noRecordsMessage.insertCell();
        cell.textContent = 'لا توجد فواتير مؤرشفة تطابق معيار البحث.';
        cell.colSpan = 4;
        archivedInvoicesBody.appendChild(noRecordsMessage);
    }
}

function showSubSection(subSectionId) {
    const innerSections = document.querySelectorAll('.inner-section');
    innerSections.forEach(innerSection => {
        innerSection.style.display = 'none';
    });
    const selectedSubSection = document.getElementById(subSectionId);
    if (selectedSubSection) {
        selectedSubSection.style.display = 'block';
        if (subSectionId === 'sales_log') {
            displaySalesLog();
        } else if (subSectionId === 'invoices_log') {
            displayInvoicesLog();
        } else if (subSectionId === 'invoices_archive') {
            displayArchivedInvoices();
        } else if (subSectionId === 'returns_sales_log') {
            displayReturnSalesLog();
        } else if (subSectionId === 'returns_invoices_log') {
            displayReturnInvoicesLog();
        }
    }
}

// تهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const dashboardContainer = document.getElementById('dashboard-container');
    if (dashboardContainer) {
        dashboardContainer.style.display = 'none'; // إخفاء لوحة التحكم في البداية
    }
    // يمكنك هنا استدعاء أي دوال تهيئة أخرى إذا لزم الأمر
});
// ... باقي الكود السابق ...

document.addEventListener('DOMContentLoaded', () => {
    const dashboardContainer = document.getElementById('dashboard-container');
    if (dashboardContainer) {
        dashboardContainer.style.display = 'none';
    }

    // أزرار وحاويات إضافة منتج
    const showAddProductButton = document.getElementById('show-add-product-form');
    const addProductForm = document.getElementById('add-product-form');
    const hideAddProductButton = document.getElementById('hide-add-product-form');

    showAddProductButton.addEventListener('click', () => {
        addProductForm.style.display = 'block';
    });

    hideAddProductButton.addEventListener('click', () => {
        addProductForm.style.display = 'none';
    });

    // أزرار وحاويات تعديل الكمية
    const showUpdateQuantityButton = document.getElementById('show-update-quantity-form');
    const updateQuantityForm = document.getElementById('update-quantity-form');
    const hideUpdateQuantityButton = document.getElementById('hide-update-quantity-form');

    showUpdateQuantityButton.addEventListener('click', () => {
        updateQuantityForm.style.display = 'block';
    });

    hideUpdateQuantityButton.addEventListener('click', () => {
        updateQuantityForm.style.display = 'none';
    });

    // أزرار وحاويات تعديل السعر
    const showUpdatePriceButton = document.getElementById('show-update-price-form');
    const updatePriceForm = document.getElementById('update-price-form');
    const hideUpdatePriceButton = document.getElementById('hide-update-price-form');

    showUpdatePriceButton.addEventListener('click', () => {
        updatePriceForm.style.display = 'block';
    });

    hideUpdatePriceButton.addEventListener('click', () => {
        updatePriceForm.style.display = 'none';
    });

    showSection('inventory'); // عرض قسم المخزون افتراضيًا بعد التحميل (أو بعد تسجيل الدخول إذا كنت تستخدم نظام تسجيل الدخول)
});

// ... باقي الكود السابق ...

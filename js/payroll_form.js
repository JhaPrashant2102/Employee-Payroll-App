let isUpdate = false;
let employeePayrollObj = {};
window.addEventListener('DOMContentLoaded',(event)=>{
    const name = document.querySelector('#name');
    const textError = document.querySelector('.text-error')
    name.addEventListener('input',function () {
            if (name.value.length == 0) {
                textError.textContent = "";
                return;
            }
            try {
                (new EmployeePayrollData()).name = name.value;
                textError.textContent = "";
            } catch (e) {
                textError.textContent = e;
            }
    });
    const salary = document.querySelector('#salary')
    const output = document.querySelector(".salary-output")
    output.textContent = salary.value;
    salary.addEventListener('input',function(){
        output.textContent = salary.value;
    });
    let day = document.getElementById("day");
    let month = document.getElementById("month");
    let year = document.getElementById("year");
    let dateError = document.querySelector(".date-error");    
    day.addEventListener('click',checkDate);
    month.addEventListener('click',checkDate);
    year.addEventListener('click',checkDate);
    function checkDate(){
        let dateString = year.value+"-"+month.value+"-"+day.value+"T00:00:00Z";
        date = new Date(dateString);
        console.log(date);
        if(date.getTime()<=(new Date()).getTime()
        &&((((new Date()).getTime())-(date.getTime()))/(1000*60*60*24))<=30 ){
            dateError.textContent = "";
        }
        else 
        dateError.textContent="Date is invalid";
    }
    checkForUpdate();
});
const save = ()=>{
    try{
        let employeePayrollData = createEmployeePayroll();
        createAndUpdateStorage(employeePayrollData);
    }catch(e){
        return;
    }
}
const createAndUpdateStorage = (employeePayrollData)=>{
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
    if(employeePayrollList!=undefined){
        employeePayrollList.push(employeePayrollData)
    }else{
        employeePayrollList=[employeePayrollData]
    }
    alert(employeePayrollList.toString())
    localStorage.setItem("EmployeePayrollList",JSON.stringify(employeePayrollList))
}
const createEmployeePayroll = ()=>{
    let employeePayrollData = new EmployeePayrollData();
    try{
        employeePayrollData.name=getInputValueById('#name')
    }catch(e){
        setTextValue('.text-error',e)
        throw e;
    }
    employeePayrollData.profilePic=getSelectedValues('[name=profile]').pop();
    employeePayrollData.gender=getSelectedValues('[name=gender]').pop();
    let departments = new Array();
    const departmentsForm = document.getElementsByClassName("checkbox");
    for(let i=0;i<departmentsForm.length;i++){
        if(departmentsForm[i].checked)
            departments.push(departmentsForm[i].value);
    }
    employeePayrollData.department=departments;
    employeePayrollData.id = new Date().getTime();
    employeePayrollData.salary=document.querySelector("#salary").value;
    employeePayrollData.note=document.getElementById("notes").value;
    let day = getInputValueById('#day')
    let month = getInputValueById('#month')
    let year = getInputValueById('#year')
    let dateString = year+"-"+month+"-"+day+"T00:00:00Z";
    date = new Date(dateString);
    alert(employeePayrollData.toString())
    return employeePayrollData
}
const getSelectedValues=(propertyValue)=>{
    let allItems = document.querySelectorAll(propertyValue)//not query selector
    let selItems = new Array();
    allItems.forEach(item=>{
        if(item.checked)
        selItems.push(item.value);
    })
    return selItems;
}
const getInputValueById = (id)=>{
    let value = document.querySelector(id).value;
    return value;
}
const getInputElementValue = (id)=>{
    let value = document.getElementById(id).value
    setValue('#name','');
    return value
}
const resetForm = ()=>{
    unsetSelectedValues('[name=profile]')
    unsetSelectedValues('[name=gender]')
    unsetSelectedValues('[name=department]')
    setValue('#salary','')
    setValue('#notes','')
    setValue('#day','1')
    setValue('#month','January')
    setValue('#year','2020')
}
const unsetSelectedValues = (propertyValue)=>{
    let allItems = document.querySelectorAll(propertyValue)
    allItems.forEach(item=>{
        item.checked=false;
    })
}
const setTextValue=(id,value)=>{
    const element = document.querySelector(id)
    element.textContent=value;
}
const setValue = (id,value)=>{
    const element = document.querySelector(id)
    element.value=value;
}
const checkForUpdate =  ()=>{
    const employeePayrollJson = localStorage.getItem('editItem');
    isUpdate = employeePayrollJson?true:false;
    if(!isUpdate) return;
    employeePayrollObj = JSON.parse(employeePayrollJson);
    setForm();
}
const setForm = ()=>{
    setValue('#name',employeePayrollObj._name);
    setSelectedValues('[name=profile]',employeePayrollObj._profilePic);
    setSelectedValues('[name=gender]',employeePayrollObj._gender);
    setSelectedValues('[name=department]',employeePayrollObj._department);
    setValue('#salary',employeePayrollObj._salary);
    setTextValue('.salary-output',employeePayrollObj._salary);
    setValue('#notes',employeePayrollObj._note);
    let date = stringifyDate(employeePayrollObj._startDate).split(" ");
    setValue('#day',day[0])
    setValue('#month',date[1])
    setValue('#year',date[2]);
}
const setSelectedValues = (propertyValue,value)=>{
    let allItems = document.querySelector(propertyValue);
    allItems.forEach(items=>{
        if(Array.isArray(value)){
            if(value.includes(item.value)){
                item.checked = true;
            }
        }
        else if(item.value==value)
        item.checked = true;
    });
}
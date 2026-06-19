//---------DISPLAY WIRING
function displayWiring(){
  document.querySelectorAll(".display-keys").forEach(btn=>{
    btn.addEventListener("click",()=>{
      document.getElementById("screen").value += btn.dataset.value
    })
  })
}
//---------TAB SWITCHING
function tabSwitching(){
  let currentTab = "main"
  document.querySelectorAll(".inv").forEach(btn=>{
    btn.addEventListener("click",()=>{
      if(currentTab == "main"){
        currentTab = "inv"
        document.getElementById("right-keys").style.display = "none"
        document.getElementById("inverse-keys").style.display = "grid"
        return
      }
      else if(currentTab=="inv"){
        currentTab = "main"
        document.getElementById("inverse-keys").style.display = "none"
        document.getElementById("right-keys").style.display = "grid"
      }
    })
  })
}
tabSwitching()
displayWiring()

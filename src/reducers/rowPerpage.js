const initialState = {
    jumlah:5,
    halaman:1,
}
function rowperpageDepart(state = initialState, action){

    switch(action.type){
        case "CHANGEROWDEPART":
            const stateuser = {...state}
            if(action.payload){
                stateuser.jumlah = action.payload.jumlah;
                stateuser.halaman = action.payload.halaman;
               
            }
            return {...stateuser}
        default:
            return state;
    }
}



function rowperpageGroup(state = initialState, action){

    switch(action.type){
        case "CHANGEROWGROUP":
            const stateuser = {...state}
            if(action.payload){
                stateuser.jumlah = action.payload.jumlah;
                stateuser.halaman = action.payload.halaman;
            }
            return {...stateuser}
        default:
            return state;
    }
}
function rowperpageMenu(state = initialState, action){
   
    switch(action.type){
        case "CHANGEROWMENU":
            const stateuser = {...state}
            if(action.payload){
                stateuser.jumlah = action.payload.jumlah;
                stateuser.halaman = action.payload.halaman;
            }
            return {...stateuser}
        default:
            return state;
    }
}
function rowperpageRole(state = initialState, action){
       
    switch(action.type){
        case "CHANGEROWROLE":
            const stateuser = {...state}
            if(action.payload){
                stateuser.jumlah = action.payload.jumlah;
                stateuser.halaman = action.payload.halaman;
            }
            return {...stateuser}
        default:
            return state;
    }
}
function rowperpageBranch(state = initialState, action){

    switch(action.type){
        case "CHANGEROWBRANCH":
            const stateuser = {...state}
            if(action.payload){
                stateuser.jumlah = action.payload.jumlah;
                stateuser.halaman = action.payload.halaman;
            }
            return {...stateuser}
        default:
            return state;
    }
}
function rowperpageUser(state = initialState, action){

    switch(action.type){
        case "CHANGEROWUSER":
            const stateuser = {...state}
            if(action.payload){
                stateuser.jumlah = action.payload.jumlah;
                stateuser.halaman = action.payload.halaman;
            }
            return {...stateuser}
        default:
            return state;
    }
}
function rowperpageLog(state = initialState, action){

    switch(action.type){
        case "CHANGEROWLOG":
            const stateuser = {...state}
            if(action.payload){
                stateuser.jumlah = action.payload.jumlah;
                stateuser.halaman = action.payload.halaman;
            }
            return {...stateuser}
        default:
            return state;
    }
}
export {
    rowperpageDepart,
    rowperpageGroup,
    rowperpageBranch,
    rowperpageRole,
    rowperpageMenu,
    rowperpageUser,
    rowperpageLog
    
  };
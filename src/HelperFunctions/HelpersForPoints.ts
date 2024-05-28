function generateID(prefix){
    let date = new Date
    let dateString = `${date.getDate()}${date.getMonth()+1}${date.getFullYear()}`
    let timeString = `${date.getHours()}${date.getMinutes()}${date.getSeconds()}`
    return `${prefix}-${dateString}-${timeString}`
}

function colorDependencies(type : string, color: string){
    // #000000 = black, 

    if(type == 'collapseBtn'){
        let newValue = color.replace('bb','')
       return newValue
    }

    if(type == 'text'){
       
        if(color == '#ff3e5fbb' || color == '#000000bb'){
            return 'white'
        }
            return 'black'
    }

    if(type == 'border'){

        if(color == '#000000bb'){
            return '1px solid white'
        }
        return '1px solid black'
    }
}
 
export {colorDependencies, generateID} ;
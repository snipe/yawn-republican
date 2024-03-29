//console.log("location is "+location)
//console.log("hash is: "+location.hash)
//console.dir(location)

var my_squares = [], selected_squares = []

function randomizer() {
    var pick_squares=[]
    for(var i=0;i<squares.length;i++) {
        pick_squares.push(i)
    }

    for(i=0;i<25;i++) {
        var chosen_square = Math.floor(Math.random()*pick_squares.length)
        my_squares.push(pick_squares[chosen_square])
        pick_squares.splice(chosen_square,1)
    }
}

function legacy_decode_hash() {
    var state = location.hash.slice(1).split(';')

    my_squares = state[0].split(',')
    if(state[1]) {
        selected_squares = state[1].split(',')
    }    
}

function legacy_encode_hash() {
    var hash = my_squares.join(",")
    if( selected_squares.length > 0) {
        hash += ';' + selected_squares.join(",")
    }
   // console.warn("hash should be: "+hash)
    location.hash = '#' + hash
}

function decode_hash() {
    var blob = atob(location.hash.slice(1))
   // console.warn("Blob is: "+blob)
   // console.warn("Blob length is: "+blob.length)
    for(var i=0;i< 25;i++) {
       // console.warn("index: "+i+" is "+blob.charCodeAt(i))
        my_squares.push(blob.charCodeAt(i))
    }
    var multiplier = 1
    var bitmap =0
    for(var i=25;i<29;i++) {
        bitmap = bitmap | blob.charCodeAt(i) * multiplier
        multiplier = multiplier * 256
    }
   // console.warn("bitmap is: "+bitmap)
    for(var i=0;i<25;i++) {
        if( bitmap & 1 << i ) {
            selected_squares.push(i.toString()) 
        }
    }
   // console.warn("My square is: "+my_squares.join(","))
   // console.warn("And selected squares are: "+selected_squares.join(","))
   // console.dir(selected_squares)
}

function encode_hash() {
    //var blob = String.fromCharCode(my_squares div 256)
    var blob = ''
    for(var i in my_squares) {
        blob += String.fromCharCode(my_squares[i])
    }
   // console.warn("Uh, blob is: "+blob)

    var selected_bitmap = 0
    for(var i=0;i<selected_squares.length;i++) {
        selected_bitmap = selected_bitmap | 1 << selected_squares[i]
    }
   // console.warn("Selected index bitmap is: "+selected_bitmap)
    for(var i = 0;i<4;i++) {
       // console.warn("for index: "+i+" Going to add number: "+(selected_bitmap % 256))
        blob+= String.fromCharCode(selected_bitmap % 256)
        selected_bitmap = Math.floor(selected_bitmap/256)
       // console.warn("New selected bitmap is: "+selected_bitmap)
    }
    var hash = btoa(blob)
   // console.warn("Final blob is: "+hash)
    location.hash = '#' + hash
}

if(location.hash == '') {
    randomizer()
    encode_hash()
} else {
    decode_hash()
}

var card = document.getElementById('card')
var selected_style = 'clicked  h-full overflow-hidden rounded-lg shadow-lg hover:drop-shadow-md font-semibold' // what style to toggle when a cell is clicked
var unselected_style = 'unclicked h-full overflow-hidden rounded-lg shadow-lg hover:bg-white font-semibold'

if (my_squares.length != 25) {
   // console.error("Need exactly 25 squares, got: "+my_squares.length)
} else {
    var contents = ''
    
    for (var square in my_squares) {
        
       // console.log("looking at square: "+square+" which corresponds to: "+my_squares[square])
        var cls = ''
       // console.warn("Selected squares are: "+selected_squares.join(",")+" and indexof is: "+selected_squares.indexOf(square)+" square is: "+square)
        if ( selected_squares.indexOf(square) !== -1 ) {
            cls = selected_style
        } else {
            cls = unselected_style
        }
        
        contents += '<div data-card="'+square+'" class="bingo_card h-full my-1 px-1 w-full md:w-1/5 lg:my-4 lg:px-4 lg:w-1/5"><article id="c'+square+'" data-card="'+square+'" class="' + cls + '"><header data-card="'+square+'" class="flex items-center justify-between leading-tight p-2 md:p-4">' + squares[my_squares[square]]+ '</header></article></div>';
      
    }

    card.innerHTML = contents
}

card.onclick = function (event) {
	
    // console.warn("click!!! "+event.target.id)
    // console.warn("event target nodename is: "+event.target.nodeName)
          
    var cell_id = event.target.attributes['data-card'].nodeValue;
	// console.dir(cell_id)
	var cell = document.getElementById('c'+cell_id);
	// console.warn("Cell ID is: "+cell_id)


        
    if (cell.className == selected_style) {
        cell.className = unselected_style
        var unselected_cell_index = selected_squares.indexOf(cell_id)
        selected_squares.splice(unselected_cell_index,1)
    } else {
        selected_squares.push()
        cell.className = selected_style
        selected_squares.push(cell_id)
    }
   // console.warn("Who is the selected styles: "+selected_squares.join(","))
    encode_hash()
}
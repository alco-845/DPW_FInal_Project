// start inisialisasi ketika page dibuka
var book = [];
var data = [];

document.addEventListener("DOMContentLoaded", function () {
    init();
  });
  
  
  function init() {
      if (localStorage.book) {
          book = JSON.parse(localStorage.book);
          data = JSON.parse(localStorage.data);
          reload("data")
        } else {
          var data1 = { code: 1, image: "komputer-grafis.jpg", book: "Komputer Grafis", status: "Tersedia" };
          var data2 = { code: 2, image: "membangun-aplikasi.jpg", book: "Membangun Aplikasi", status: "Tersedia" };
          var data3 = { code: 3, image: "menguasai-pemrograman.jpg", book: "Menguasai Pemrograman", status: "Tersedia" };
          var data4 = { code: 4, image: "excel.jpg", book: "Microsoft Excel", status: "Tersedia" };
          book.push(data1, data2, data3, data4);
          reload("data")
        }
  }
// end of inisialisasi ketika page dibuka

// start cari buku
var codeBook = document.getElementById('code');
var bookBody = document.getElementById('bookBody');
codeBook.addEventListener('keyup', check);

function check(e) {
    bookBody.innerHTML = listBook(e.target.value);
    if (book == "" || e.target.value == "") 
      bookBody.innerHTML = ''
  }
  
  const listBook = (query) => {
    var dataBook = JSON.parse(localStorage.book);
    
    return jenisBuku(dataBook, query);
  }
  
  const jenisBuku = (dataBook, query) => {
    document.getElementById("listBook").style.display = "none"    
    var body = '';

    for(var r in dataBook)
    {
      body +="<tr align=center onclick='add(" + dataBook[r].code + " );' >";
        if (query == dataBook[r].code) {      
            document.getElementById("listBook").style.display = "block"
            body +='<td>' + dataBook[r].code + '</td>';
            body +='<td>' + dataBook[r].book + '</td>';
            body +='<td>' + dataBook[r].status + '</td>';
        }
      body +='</tr>';
    }

    return body
  }
// end of cari buku

// start insert buku
document.getElementById("form").addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  function addBook() {
    const borrowerName = document.getElementById("nama").value;
    const codeBook = document.getElementById("code").value;
    const timeBorrowed = document.getElementById("date").value;
    const timeBack = document.getElementById("date1").value;
  
    if (timeBorrowed > timeBack) {
      alert("Tanggal dikembalikan tidak boleh lebih awal dari tanggal meminjam!");    
    } else if (book[codeBook-1] == null) {
      alert("Kode buku yang anda masukan tidak ada");
    } else if (book[codeBook-1].status == "Dipinjam") {
      alert("Kode buku yang anda masukan sedang dipinjam oleh orang lain");
    } else {
      insertBook(borrowerName, codeBook, timeBorrowed, timeBack, false);
      reload("data");
    }
  }

function insertBook(nama, code, borrowed, back, isCompleted) {
  var item = {
    status: isCompleted,
    nama: nama,
    code: code,
    timeBorrowed: borrowed,
    timeBack: back,
  };
  data.push(item);
  book[code-1].status = "Dipinjam";
  reload("data");
  alert("Sukses meminjam");
  window.location.href = "buku_pinjam.html";
}
// end of insert buku

// start show borrowed book
function showBorrowedBook() {
  document.getElementById("todos").innerHTML = "";

  var totalBorrowed = 0

    for (var i in data) {

        if (!data[i].status) {

            const textTitle = document.createElement("h2");
            textTitle.innerText = book[data[i].code - 1].book;

            const textName = document.createElement("h4");
            textName.innerText = "Nama peminjam : " + data[i].nama;

            const textTimeBorrowed = document.createElement("h4");
            textTimeBorrowed.setAttribute("id", "timeBorrowed");
            textTimeBorrowed.innerText = "Tanggal pinjam : " + data[i].timeBorrowed;

            const textTimeBack = document.createElement("h4");
            textTimeBack.setAttribute("id", "timeBack");
            textTimeBack.innerText = "Akan dikembalikan pada : " + data[i].timeBack;

            const textContainer = document.createElement("div");
            textContainer.classList.add("inner");
            textContainer.append(textTitle, textName, textTimeBorrowed, textTimeBack);

            const image = document.createElement("img");
            image.setAttribute("src", "assets/img/"+ book[data[i].code -1].image +" ");

            const container = document.createElement("div");
            container.classList.add("item", "bayang");
            container.append(image, textContainer);
            
            container.append(createCheckButton(i));

            const item = document.getElementById("todos");
            item.append(container);

            totalBorrowed += 1
        }

    }
    document.getElementById("totalBorrowed").innerText = "Total buku yang dipinjam : " + totalBorrowed;
}
// end of show borrowed book

// start show back book
function showBackBook() {
    document.getElementById("todos").innerHTML = "";
    var totalBack = 0
  
      for (var i in data) {
  
          if (data[i].status) {  
              const textTitle = document.createElement("h2");
              textTitle.innerText = book[data[i].code - 1].book;
  
              const textName = document.createElement("h4");
              textName.innerText = "Nama peminjam : " + data[i].nama;
  
              const textTimeBorrowed = document.createElement("h4");
              textTimeBorrowed.setAttribute("id", "timeBorrowed");
              textTimeBorrowed.innerText = "Tanggal pinjam : " + data[i].timeBorrowed;
  
              const textTimeBack = document.createElement("h4");
              textTimeBack.setAttribute("id", "timeBack");
              textTimeBack.innerText = "Telah dikembalikan pada : " + data[i].timeBack;
  
              const textContainer = document.createElement("div");
              textContainer.classList.add("inner");
              textContainer.append(textTitle, textName, textTimeBorrowed, textTimeBack);
  
              const image = document.createElement("img");
              image.setAttribute("src", "assets/img/"+ book[data[i].code -1].image +" ");
  
              const container = document.createElement("div");
              container.classList.add("item", "bayang");
              container.append(image, textContainer);       

              const item = document.getElementById("todos");
              item.append(container);
  
              totalBack += 1
          }
  
      }
      document.getElementById("totalBack").innerText = "Total buku yang dikembalikan : " + totalBack;
  }
  // end of show back book

function reload(type) {
  if (window.localStorage && type == "book") {
    localStorage.book = JSON.stringify(book);
  } else {
    localStorage.book = JSON.stringify(book);
    localStorage.data = JSON.stringify(data);
  }
}


function createCheckButton(index) {
  return createButton("check-button", function (event) {
    addTaskToCompleted(event.target.parentElement, index);
  });
}

function createButton(buttonTypeClass, eventListener) {
  const button = document.createElement("button");
  button.classList.add(buttonTypeClass);
  button.addEventListener("click", function (event) {
    eventListener(event);
  });
  return button;
}

function addTaskToCompleted(taskElement, index) {
  book[index].status = "Tersedia";
  data[index].status = true;
  taskElement.remove();
  reload("data");
  showBorrowedBook();
}

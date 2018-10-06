let content = document.getElementById('content');
let overlay = document.getElementsByClassName('overlay').item(0);
let array = [];

function showData(programms) {
    let div = document.createElement('div');
    div.setAttribute('class', 'row')
    div.innerHTML = `<div>${programms.name}</div>
                     <div>${programms.language}</div>
                     <div>${programms.genres}</div>
                     <div>${programms.status}</div>
                     <div>${+programms.rating.average}</div>`;
    content.appendChild(div);
}

function showLoader() {
    setTimeout(function () {
        let title = document.getElementById('title');
        title.style.display = 'none';
        let hr = document.getElementsByTagName('hr');
        hr.item(0).style.display = 'none';
        let loader = document.getElementById('lds_ring');
        loader.style.display = 'block';
        setTimeout(function () {
            let loader = document.getElementById('lds_ring');
            loader.style.display = 'none';
        }, 200)
    }, 0);
}

function showTable(array) {
    setTimeout(function () {
        if (array.length === 0) {
            let title = document.getElementById('title');
            title.style.display = 'none';
            let hr = document.getElementsByTagName('hr');
            hr.item(0).style.display = 'none';
            let p = document.getElementById('no_data');
            p.style.display = 'block';

        } else {
            let title = document.getElementById('title');
            let hr = document.getElementsByTagName('hr');
            let p = document.getElementById('no_data');

            if (title.style.display == 'none') {
                title.style.display = 'flex';
                hr.item(0).style.display = 'block';
                p.style.display = 'none';

            }
            array.forEach(programms => {
                showData(programms);
            })
        }
    }, 200)
}

function sortAsc(event) {
    if (event.target.innerHTML === 'Show name ↑') {
        event.target.innerHTML = 'Show name ↓';
        array.sort(function compareName(a, b) {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
        })
        content.innerHTML = ' ';
        array.forEach(programms => { showData(programms) });
    } else if (event.target.innerHTML === 'Rating ↑') {
        event.target.innerHTML = 'Rating ↓';
        array.sort(function compareNumber(a, b) {
            return (+a.rating.average - +b.rating.average);
        })
        content.innerHTML = ' ';
        array.forEach(programms => { showData(programms) });
    }
}

function sortDesc(event) {
    if (event.target.innerHTML === 'Show name ↓') {
        event.target.innerHTML = 'Show name ↑';
        array = array.sort(function compareName(a, b) {
            if (a.name < b.name) return 1;
            if (a.name > b.name) return -1;
        })
        content.innerHTML = ' ';
        array.forEach(programms => { showData(programms) });
    } else if (event.target.innerHTML === 'Rating ↓') {
        event.target.innerHTML = 'Rating ↑';
        array = array.sort(function compareNumber(a, b) {
            return (+b.rating.average - +a.rating.average);
        })
        content.innerHTML = ' ';
        array.forEach(programms => { showData(programms) });
    }
}

function showWindowsModal(event) {
    overlay.style.display = 'block';
    array.forEach(programms => {
        if (programms.name === event.path[1].firstChild.innerText) {
            let div = document.createElement('div');
            div.setAttribute('id', 'info')
            div.style.border = '0px';
            div.innerHTML = `<image src = ${programms.image.original}></image></hr>
                            <div class="genres">Genres: ${programms.genres.length ? programms.genres.join(' | ') : '-'}</div>
                            <div class="language">Language: ${programms.language ? programms.language : '-'}</div>
                            <div class="name">Name: ${programms.name ? programms.name : '-'}</div>
                            <div class="officalSite">Official Site: <a href="${programms.officialSite}" target="_blank">${programms.officialSite ? programms.officialSite : ''}</a></div>
                            <div class="premiered">Premiered: ${programms.premiered ? programms.premiered : '-'}</div>
                            <div class="rating">Rating: ${programms.rating.average ? programms.rating.average : '-'}</div>
                            <div class="runtime">Runtime: ${programms.runtime ? programms.runtime : '-'} min</div>
                            <div class="schedule">Schedule: <span class="days">${programms.schedule.days[0] ? programms.schedule.days[0] : '-'}</span>
                            <span class="Time"> at (${programms.schedule.time ? programms.schedule.time : '-'})</span></div>
                            <div class="status">Status: ${programms.status ? programms.status : '-'}</div>
                            <div class="type">Type: ${programms.type ? programms.type : '-'}</div>
                            <div class="summary">Summary: ${programms.summary ? programms.summary : '-'}</div>`;
            document.getElementById('modal').appendChild(div);
        }
    })

}


window.onload = () => {
    fetch('http://api.tvmaze.com/search/shows?q=girls')
        .then(response => {
            response.json().then(data => {
                data.forEach(elem => {
                    array.push(elem.show);
                })
                array.forEach(programms => {
                    showData(programms);
                })
            })
        })
        .catch(error => {
            console.log(error);
        });
}

document.getElementById('title').onclick = (event) => {

    if (event.target.innerHTML === 'Show name ↑' || event.target.innerHTML === 'Rating ↑') {
        console.log(event.target);
        sortAsc(event);
    } else if (event.target.innerHTML === 'Show name ↓' || event.target.innerHTML === 'Rating ↓') {
        console.log(event.target);
        sortDesc(event);
    }

}

document.getElementById('search').onclick = () => {

    content.innerHTML = ' ';
    let string = document.getElementById('input').value;

    fetch(`http://api.tvmaze.com/search/shows?q=${string}`)
        .then(response => {
            response.json().then(data => {
                array = [];
                data.forEach(elem => {
                    array.push(elem.show);
                })
                showLoader();
                showTable(array);
            })
        })
        .catch(error => {
            console.log(error);
        });
}

document.getElementById('input').addEventListener('keyup', () => {

    content.innerHTML = ' ';
    let string = document.getElementById('input').value;

    fetch(`http://api.tvmaze.com/search/shows?q=${string}`)
        .then(response => {
            response.json().then(data => {
                array = [];
                data.forEach(elem => {
                    array.push(elem.show);
                })
                showLoader();
                showTable(array);
            })
        })
        .catch(error => {
            console.log(error);
        });
})

content.onclick = (event) => {
    showWindowsModal(event);
}

document.getElementsByClassName('close').item(0).onclick = function closeWindowsModal(event) {
    overlay.style.display = 'none';
    document.getElementById('modal').removeChild(document.getElementById('info'));    
}
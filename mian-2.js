// // 1. Render song + 
// // 2. Scroll top +
// // 3. Play / pause / Seek +
// // 4. CD rotate +
// // 5. Next /prev +
// // 6. Random song +
// // 7. Next / repeat when song  ended +
// // 8. Action song +
// // 9. Scroll active song into view +
// // 10. Play song when clik in name song +



const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


const playlist = $('.playlist');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const playbtn = $('.btn-toggle-play');
const audio = $('#audio');
const player = $('.player');
const progress = $('.progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
console.log( randomBtn);


const app = {   

    currentIndex: 0,

    isPlaying: false,

    isRandom: false,

    isRepeat: false,

    songs: [
        {
            name: 'bai-1',
            singer: 'tac-gia-1',
            path: './asset/music/song1.mp3',
            image: './asset/img/song1_1.png'
        },
        {
            name: 'bai-2',
            singer: 'tac-gia-2',
            path: './asset/music/song2.mp3',
            image: './asset/img/song2_1.png'
        },
        {
            name: 'bai-3',
            singer: 'tac-gia-3',
            path: './asset/music/song3.mp3',
            image: './asset/img/song3_1.png'
        },
        {
            name: 'bai-4',
            singer: 'tac-gia-4',
            path: './asset/music/song4.mp3',
            image: './asset/img/song4_1.png'
        },
        {
            name: 'bai-5',
            singer: 'tac-gia-5',
            path: './asset/music/song4.mp3',
            image: './asset/img/song4_1.png'
        },
        {
            name: 'bai-6',
            singer: 'tac-gia-6',
            path: './asset/music/song4.mp3',
            image: './asset/img/song4_1.png'
        },
        {
            name: 'bai-7',
            singer: 'tac-gia-7',
            path: './asset/music/song4.mp3',
            image: './asset/img/song4_1.png'
        }
    ],
    // Phương thức Render nhạc 
    render: function(){
        const htmls = this.songs.map((song , index)=>{
            return `    
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
            <div class="thumb" style="background-image: url('${song.image}')" ></div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
        `
        })
        playlist.innerHTML = htmls.join('');
    },
    // Phương thức lắng nghe / xử lí sự kiện
    handleEvent: function (){
        const _this = this;
         const cdWidth = cd.offsetWidth ;
        // Xử lí thu nhỏ / phóng to đĩa
        document.onscroll = function(){
            const scrollwidth = Math.floor(document.documentElement.scrollTop  || window.scrollY);
            const newWidth = cdWidth - scrollwidth ;
            
            cd.style.width = newWidth > 0  ? newWidth + 'px' : 0 + 'px';
            cd.style.opacity = 1 -  (scrollwidth/cdWidth);
        }
        // xử lí quay CD / dừng CD
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 100000,
            interations: Infinity
        })
        cdThumbAnimate.pause();
        // Lắng nghe sự kiện play
        playbtn.onclick = function (){
            if(_this.isPlaying === false){
               
                audio.play();
                cdThumbAnimate.play();
            }else{
                
                audio.pause();
                cdThumbAnimate.pause();
            }
        }
        // Xử lí sự kiện phaying 
        audio.onplay = function (){
            _this.isPlaying = true;
            player.classList.add('playing');
        }
        // Xử lí sự kiện pause
        audio.onpause = function (){
            _this.isPlaying = false
            player.classList.remove('playing');
        }
        // Cập nhật tiến độ âm thang trên thanh input 
        audio.ontimeupdate = function(){
            if(audio.duration){
                progress.value = (audio.currentTime / audio.duration * 100);
            }
         
        } 
        // Xử lí tua nhạc
        progress.onchange = function (e){
            audio.currentTime = e.currentTarget.value / 100 * audio.duration;
            audio.play();    
        }
        // lắng nghe next bài hát 
        nextBtn.onclick = function(){
            _this.nextSong();
            _this.render();
            _this.Scrollactivesong();
            audio.play();
        }
        // Lắng nghe prev bài hát
        prevBtn.onclick = function(){
            _this.prevSong();
            _this.render();
            audio.play();
            _this.Scrollactivesong();
        }
        // Lắng nghe sự kiện Random list nhạc  
        randomBtn.onclick = function (e) {
            if(_this.isRandom== false){
                _this.isRandom = true;
                e.currentTarget.classList.toggle('active');
            }else{
                _this.isRandom = false;
                e.currentTarget.classList.remove('active');
            }
        }
        // Lắng nghe sự kiện repeat
        repeatBtn.onclick= function(e){
            if (_this.isRepeat === false){
                _this.isRepeat = true;
                e.currentTarget.classList.toggle('active');
            }else{
                _this.isRepeat = false;
                e.currentTarget.classList.remove('active');
            }
        }
        // next nhạc khi endtimeout 
        audio.onended = function(){
                if(_this.isRepeat){
                    _this.loadCurrentSong();    
                }else{
                    _this.nextSong();
                }
            audio.play();
            cdThumbAnimate.play();
        }
        // play nhac khi click vao song 
        playlist.onclick = function(e){
           _this.playSongWhenClick(e);
           _this.render();
           audio.play();
           _this.Scrollactivesong();
          
        }
        
    },
    // Phương thức khởi tạo các thuộc tính(property) mới cho object
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong'  , {
            get: function(){
                return this.songs[this.currentIndex];
            }
        })

    },
    // Phương thức tải nhạc lên render
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage  = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
        // console.log(heading , cdThumb , audio)
    },

    // Phương thức next nhạc ( chuyển bài hát )
    nextSong: function(){
        if(this.isRandom === true){
            this.RandomSong();
        }
        else{
            this.currentIndex++;
            if (this.currentIndex == this.songs.length) {
                this.currentIndex = 0;
            }
        }
        this.loadCurrentSong();  
    },

// Phương thức prev nhạc
    prevSong: function(){
        if (this.isRandom == true){
            this.RandomSong();
        }else{
            this.currentIndex--;
            if (this.currentIndex < 0) {
                this.currentIndex = 0;
            }
        }
        this.loadCurrentSong();

       
    },

// Phương thức random nhạc
    RandomSong: function (){
        let x = Math.floor(Math.random() * this.songs.length);
        while(x === this.currentIndex){
            x = Math.floor(Math.random() * this.songs.length);
        }
        this.currentIndex = x;
    },
// phương thức Scrpll view list song 
    Scrollactivesong: function () {
        setTimeout(() => {
            if ($('.active')) {
                $('.active').scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
            }
        }, 250);
    },

// Phương thúc play nhạc khi click vào song
    playSongWhenClick: function(e){
        let songNode = e.target.closest('.song:not(.active)');
        let optionNode = e.target.closest('.option');
        if(songNode && !optionNode){
            // console.log(songNode.dataset.index);
            this.currentIndex = Number(songNode.dataset.index);
        } 
        this.loadCurrentSong();
            
  
    },

    start: function(){
        // khởi tạo các thuộc tính mới cho object
        this.defineProperties();
        // Tải nhạc lên render
        this.loadCurrentSong();
        // render nhạc
        this.render();
        // Lắng nghe / xử lí   sự kiện
        this.handleEvent();
        
   
    }

}


app.start();










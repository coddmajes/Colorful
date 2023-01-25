var g_level = document.querySelector( '.level-gaming')
var g_score = document.querySelector( '.score-gaming')
var g_time = document.querySelector( '.score-time-sign')
//var g_vector = document.querySelector( '.game_vector')
//var g_label_attr = document.querySelector( '.label_attr')
//var g_stage = document.querySelector('.stage')
var g_three_d_box = document.querySelector('.three-d-box')
var g_box_1 = document.getElementById('li1')
var g_box_2 = document.getElementById('li2')
var g_box_3 = document.getElementById('li3')
var g_box_4 = document.getElementById('li4')
var g_box_5 = document.getElementById('li5')
var g_box_6 = document.getElementById('li6')


var btn_yes = document.querySelector('.yes')
var btn_no = document.querySelector( '.no')
var begin_mask = document.querySelector('.begin_mask')
var over_mask = document.querySelector('.over_mask')
var startButton = document.querySelector('.start')
var restartButton = document.querySelector('.restart')
var score = document.querySelector('.score')
var main_content = document.querySelector('.game_main_content')

//var init_color = 1 //用于指示初始化的游戏框颜色 为0时代表需要切换颜色
/*
var n_color = 0
var n_font_color = 1
var n_label = 1
*/

var Game = function () {
	this.config = {
		isMobile: false,
		helper: false, // 默认关闭helper
		background: 0x1DB0B8, // 背景颜色
		ground: -1, // 地面y坐标
		n_cubeWidth: 3, // 方块宽度
		n_cubeHeight: 1, // 方块高度
		n_cubeDeep: 3, // 方块深度
	}
	this.n_dimension = 2 //设定游戏的维数
	this.n_canvas_color = "white" //用于主box的表面颜色
	this.n_color = 0 //用于主游戏框的颜色转换
	this.n_font_color = 1 //用于游戏label字体颜色
	this.n_label = 1//用于文字显示
	this.time = 0 // 记时
	this.last_time = 10 //记住上一level的时间
	this.level = 1//level
	this.last_level = 1
	this.level_score = 10 //每个level要求的score
	this.last_level_score = 0//记住上一level的得分要求
	this.time_id = 0
	//this.n_hardLevel = 8//每次随机的数字
	this.size = {
		width: window.innerWidth,
		height: window.innerHeight,
	}
	this.cubes = [] // 方块数组
	if(this.n_dimension == 3)
	{
		main_content.style.visibility = 'none'

		this.scene = new THREE.Scene()
		this.cameraPos = {
			current: new THREE.Vector3(0, 0, 0), // 摄像机当前的坐标
			next: new THREE.Vector3() // 摄像机即将要移到的位置
		}
		this.camera = new THREE.OrthographicCamera(this.size.width / -80, this.size.width / 80, this.size.height / 80, this.size.height / -80, 0, 5000)
		this.renderer = new THREE.WebGLRenderer({antialias: true})

		var planceGeometry = new THREE.PlaneGeometry(this.size.width, this.size.height);    // PlaneGeometry: 翻译 平面几何    (参数: 宽60, 高20)
		var planeMaterial = new THREE.MeshLambertMaterial({ color: 0x1DB0B8 });    // MeshLambertMaterial: 翻译 网格材质    (用来设置平面的外观, 颜色，透明度等)
		var plane = new THREE.Mesh(planceGeometry, planeMaterial);    // 把这2个对象合并到一个名为plane(平面)的Mesh(网格)对象中
		plane.receiveShadow = true;    // 平面接收阴影
		plane.rotation.x = -0.5*Math.PI;    // 绕x轴旋转90度
		plane.position.x = 0;    // 平面坐标位置
		plane.position.y = -1;
		plane.position.z = 0;
		this.plane = plane;
		this.scene.add(this.plane);    // 将平面添加到场景
	}


	/*******游戏结束，包括二个方面，
	 * 第一按yes/no弄错了，---通过在yes/no btn处进行操作
	 * 第二，在规定时间内分数没有达到每个关卡的要求--
	 * （1）通过start btn直接game over
	 * （2）通过 restart btn game over
	 * */
	this.game_over = 0//标示是否通过yes/no结束任务,0标示未结束 1结束
	//this.restartYes = 0//标示是否重新任务,0标示重新 1未重新
	this.scoreYes = 0 //标示是否达到分数,0标示达到 1未达到

	this.score = 0
	//this.scene = new THREE.Scene()

}
Game.prototype = {
	init: function () {
		g_box_1.innerText = "white"
		g_box_1.style.color = "white"
		g_box_2.innerText = "white"
		g_box_2.style.color = "white"
		g_box_3.innerText = "white"
		g_box_3.style.color = "white"
		g_box_4.innerText = "white"
		g_box_4.style.color = "white"
		g_box_5.innerText = "white"
		g_box_5.style.color = "white"
		g_box_6.innerText = "white"
		g_box_6.style.color = "white"
		//g_label_attr.innerHTML = "white"
		//g_label_attr.style.color = "red"

		/*
		// 监听窗口变化的事件
		window.addEventListener('resize', function () {
			this._handleWindowResize()
		})
		*/
	},
	/*
	// 窗口缩放绑定的函数
	_handleWindowResize: function () {
		this._setSize()
		this.camera.left = this.size.width / -80
		this.camera.right = this.size.width / 80
		this.camera.top = this.size.height / 80
		this.camera.bottom = this.size.height / -80
		this.camera.updateProjectionMatrix()
		this.renderer.setSize(this.size.width, this.size.height)
		this._render()
	},*/
	// 新增一个方块,
	_createCube: function () {
		var geometryObj = this._createGeometry(); // 生成一个几何体
		var materialObj = this._createMaterial()(); // 生成材质

		var mesh = new THREE.Mesh(geometryObj.geometry, materialObj.material)
		mesh.castShadow = true; // 产生阴影
		mesh.receiveShadow = true;    // 接收阴影

		if( this.cubes.length ) {
			//this.cubeStat.nextDir =  Math.random() > 0.5 ? 'left' : 'right'
			mesh.position.x = this.cubes[this.cubes.length - 1].position.x
			mesh.position.y = this.cubes[this.cubes.length - 1].position.y
			mesh.position.z = this.cubes[this.cubes.length - 1].position.z

		}

		this.scene.add(mesh)

	},
	_createMaterial: function() { // 生成材质/贴图
		var config = this.config;
		this.n_canvas_color = this.Vector_Color()
		// 所有的材质数组
		var materials = [
			{
				material: new THREE.MeshLambertMaterial({color: this.n_canvas_color}),
				type: 'DefaultCubeColor'
			},
			RandomColor(),
			//clockMaterial(),
			//RadialGradient(),
			//RadialGradient2(),
			//wireFrame(),
		];

		return function (idx) {
			if (idx == undefined) {
				idx = Math.floor(Math.random() * materials.length);
			}
			return materials[idx];
		}

		/*
                function clockMaterial() {
                    var texture;
                    var matArray = []; // 多贴图数组

                    texture = new THREE.CanvasTexture(canvasTexture); // 此处的canvasTexture来自canvas.texture.js文件
                    texture.needsUpdate = true;

                    matArray.push(new THREE.MeshLambertMaterial({color: this.n_canvas_color}));
                    matArray.push(new THREE.MeshLambertMaterial({color: this.n_canvas_color}));
                    matArray.push(new THREE.MeshBasicMaterial({ map: texture }));
                    matArray.push(new THREE.MeshLambertMaterial({color: this.n_canvas_color}));
                    matArray.push(new THREE.MeshLambertMaterial({color: this.n_canvas_color}));
                    matArray.push(new THREE.MeshLambertMaterial({color: this.n_canvas_color}));

                    return {
                        material : matArray,
                        type: 'Clock'
                    }
                }

                function RadialGradient() {
                    var texture;
                    var matArray = []; // 多贴图数组

                    var canvasTexture1 = document.createElement("canvas");
                    canvasTexture1.width=16;
                    canvasTexture1.height=16;
                    var ctx= canvasTexture1.getContext("2d");
                    // 创建渐变
                    var grd=ctx.createRadialGradient(50,50,32,60,60,100);
                    grd.addColorStop(0,"red");
                    grd.addColorStop(1,"white");
                    // 填充渐变
                    ctx.fillStyle=grd;
                    ctx.fillRect(10,10,150,80);

                    texture = new THREE.CanvasTexture(canvasTexture1);
                    texture.needsUpdate = true;
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping; // 指定重复方向为两个方向
                    texture.repeat.set(5,5); // 设置重复次数都为4

                    matArray.push(new THREE.MeshLambertMaterial({color: this.n_canvas_color}));
                    matArray.push(new THREE.MeshLambertMaterial({color: this.n_canvas_color}));
                    matArray.push(new THREE.MeshBasicMaterial({ map: texture }));
                    matArray.push(new THREE.MeshLambertMaterial({color: this.n_canvas_color}));
                    matArray.push(new THREE.MeshLambertMaterial({color: this.n_canvas_color}));
                    matArray.push(new THREE.MeshLambertMaterial({color: this.n_canvas_color}));

                    return {
                        material : matArray,
                        type: 'RadialGradient'
                    }
                }

                function RadialGradient2() {

                    var canvas = document.createElement('canvas');
                    canvas.width = 16;
                    canvas.height = 16;

                    var context = canvas.getContext('2d');
                    var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
                    gradient.addColorStop(0, 'rgba(255,255,255,1)');
                    gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
                    gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
                    gradient.addColorStop(1, 'rgba(0,0,0,1)');

                    context.fillStyle = gradient;
                    context.fillRect(0, 0, canvas.width, canvas.height);

                    var matArray = []; // 多贴图数组
                    var texture = new THREE.Texture(canvas);
                    texture.needsUpdate = true;

                    matArray.push(new THREE.MeshLambertMaterial({color: this.n_canvas_color}));
                    matArray.push(new THREE.MeshLambertMaterial({color: this.n_canvas_color}));
                    matArray.push(new THREE.MeshBasicMaterial({ map: texture }));
                    matArray.push(new THREE.MeshLambertMaterial({color: this.n_canvas_color}));
                    matArray.push(new THREE.MeshLambertMaterial({color: this.n_canvas_color}));
                    matArray.push(new THREE.MeshLambertMaterial({color: this.n_canvas_color}));

                    return {
                        material : matArray,
                        type: 'RadialGradient2'
                    }
                }
        */
		function RandomColor() {
			//var color = this.n_canvas_color
			return {
				material: new THREE.MeshLambertMaterial({color: this.n_canvas_color}),
				type: 'RandomColor',
				color: this.n_canvas_color,
			}
		}
	},
/*
		function wireFrame(){
			return {
				material: new THREE.MeshLambertMaterial({color: this.n_canvas_color, wireframe: true}),
				type: 'wireFrame'
			}
		}

	},
	*/
	_createGeometry: function(){ // 生成几合体
		var obj = {};
		if(Math.random() > 0.5){  // 添加圆柱型方块
			obj.geometry = new THREE.CylinderGeometry(this.config.n_cubeWidth / 2, this.config.n_cubeWidth / 2, this.config.n_cubeHeight, 40)
			obj.type = 'CylinderGeometry';
		}else{ // 方块
			obj.geometry = new THREE.CubeGeometry(this.config.n_cubeWidth,this.config.n_cubeHeight,this.config.n_cubeDeep)
			obj.type = 'CubeGeometry';
		}
		return obj;
	},
	_setSize: function () {
		this.size.width = window.innerWidth,
			this.size.height = window.innerHeight
	},

	_render: function () {
		this.renderer.render(this.scene, this.camera)
	},
	// THREE.js辅助工具
	_createHelpers: function () {
		// 法向量辅助线
		var axesHelper = new THREE.AxesHelper(10)
		this.scene.add(axesHelper);

		// 平行光辅助线
		var helper = new THREE.DirectionalLightHelper(this.directionalLight, 5 );
		this.scene.add( helper );
	},
	// 检测是否手机端
	_checkUserAgent: function () {
		var n = navigator.userAgent;
		if (n.match(/Android/i) || n.match(/webOS/i) || n.match(/iPhone/i) || n.match(/iPad/i) || n.match(/iPod/i) || n.match(/BlackBerry/i)){
			this.config.isMobile = true
		}
	},
	_setCamera: function () {
		this.camera.position.set(100, 100, 100)
		this.camera.lookAt(this.cameraPos.current)
	},
	_setRenderer: function () {
		this.renderer.setSize(this.size.width, this.size.height)
		this.renderer.setClearColor(this.config.background)
		this.renderer.shadowMap.enabled = true; // 开启阴影

		document.querySelector(".game_main_content").appendChild(this.renderer.domElement)
	},
	_setLight: function () {
		var light = new THREE.AmbientLight( 0xffffff, 0.3 )
		this.scene.add( light )

		this.directionalLight = new THREE.DirectionalLight( 0xffffff , 10);
		this.directionalLight.distance = 0;
		this.directionalLight.position.set( 60, 50, 40 )
		this.directionalLight.castShadow = true; // 产生阴影
		this.directionalLight.intensity = 0.5;
		this.scene.add(this.directionalLight)
	},
	start: function () {
		if(this.n_dimension == 3)
		{
			this._checkUserAgent() // 检测是否移动端
			this._setCamera() // 设置摄像机位置
			this._setRenderer() // 设置渲染器参数
			this._setLight() // 设置光照
			this._createCube() // 加一个方块
			if(this.config.helper) {  // 开启helper
				this._createHelpers();
			}
			// 事件绑定到canvas中,每次切换颜色
			var canvas = document.querySelector('canvas')
			canvas.addEventListener('click', function () {
				// console.log('mousedown');
				//self._handleMousedown()
			})
		}

		else if(this.n_dimension == 2)
		{
			//持续游戏
			this.Game_Design()
			//设定level和记时
			this.Game_levelCount()
			this.Game_timeCount()
		}

	},

	/*
    // 游戏成功的执行函数, 外部传入
    addSuccessFn: function (fn) {
        this.successCallback = fn
    },
    // 游戏失败的执行函数, 外部传入
    addFailedFn: function (fn) {
        this.failedCallback = fn
    },
    */
	Vector_Color : function()
	{
		this.n_color = Math.round(Math.random() * 7 + 1);
		if(this.n_dimension == 2)
		{
			this.random_Vector_Color(this.n_color) //2d游戏1 颜色贴
		}
		else if(this.n_dimension == 3)
		{
			//设置背景颜色
			return this.random_Vector_Color(this.n_color)
		}

	},
	Label_Color : function()
	{
		//设置字体颜色，/字体颜色不能和背景颜色重合
		this.n_font_color = Math.round(Math.random() * 7 + 1);
		if(this.n_color==this.n_font_color)
		{
			this.n_font_color = (this.n_font_color+1)%8
		}
		this.random_Label_Color(this.n_font_color)
	},
	Label_eng : function()
	{
		//设置显示的字的内容
		this.n_label = Math.round(Math.random() * this.n_color +1)
		if(this.n_label>=9 || this.n_label==0)
		{
			this.n_label = Math.round(Math.random() * 7 + 1);
		}
		this.random_Label(this.n_label)
		//g_label_attr.innerHTML = "white"
	},

	random_Vector_Color: function (change_color) {
		if(this.n_dimension == 2)
		{
			//g_three_d_box.style.background = this.numToColor(change_color)
			g_box_1.style.background = this.numToColor(change_color)
			//g_box_1 = this.numToColor(change_color)
			g_box_2.style.background = this.numToColor(change_color)
			g_box_3.style.background = this.numToColor(change_color)
			g_box_4.style.background = this.numToColor(change_color)
			g_box_5.style.background = this.numToColor(change_color)
			g_box_6.style.background = this.numToColor(change_color)
			return g_box_1.style.backgroundColor
			//return g_vector.style.background = this.numToColor(change_color)//2d游戏1
		}
		else if(this.n_dimension == 3)
		{
			return this.n_canvas_color = this.numToColor(change_color)//3d游戏贴颜色
		}
	},
	random_Label_Color: function (change_color) {
		g_box_1.style.color = this.numToColor(change_color)
		g_box_2.style.color = this.numToColor(change_color)
		g_box_3.style.color = this.numToColor(change_color)
		g_box_4.style.color = this.numToColor(change_color)
		g_box_5.style.color = this.numToColor(change_color)
		g_box_6.style.color = this.numToColor(change_color)
		return g_box_6.style.color
		//return g_label_attr.style.color = this.numToColor(change_color)

	},
	random_Label: function (change_label) {
		//return g_label_attr.innerHTML = this.numToColor(change_label)
		g_box_1.innerHTML = this.numToColor(change_label)
		g_box_2.innerHTML = this.numToColor(change_label)
		g_box_3.innerHTML = this.numToColor(change_label)
		g_box_4.innerHTML = this.numToColor(change_label)
		g_box_5.innerHTML = this.numToColor(change_label)
		g_box_6.innerHTML = this.numToColor(change_label)
	},
	numToColor : function (change_color) {
		switch (change_color) {
			case 1:
				return "white"
				break;
			case 2:
				return "red"
				break;
			case 3:
				return "green"
				break;
			case 4:
				return "blue"
				break;
			case 5:
				return "yellow"
				break;
			case 6:
				return "purple"
				break;
			case 7:
				return "black"
				break;
			case 8:
				return "orange"
				break;
		}

	},
	//游戏继续进行，游戏框刷新
	Game_Design : function()
	{
		this.Vector_Color()
		this.Label_Color()
		this.Label_eng()
	},
	Game_levelCount : function()
	{
		if(this.level <=this.last_level || this.scoreYes == 1 || this.game_over == 1)
		{
			this.time = 0 // 记时
			this.last_time = 10 //记住上一level的时间
			this.level = 1//level
			this.last_level_score =0
		}
		this.time = this.last_time + (this.level-1)*10;
		this.last_level = this.level
		//this.level = this.level+1
		g_level.innerHTML = "LEVEL:" + "   " + this.level
		this.last_time = this.time
	},
	Game_timeCount: function()
	{
		var that = this
		if(this.time>=0 )
		{
			g_time.innerHTML = "TIME:" +"   " + this.time
			this.time = this.time -1

			this.time_id = setTimeout(function () {that.Game_timeCount()

			}, 1000)
		}
		else{
			if(this.Game_ScoreYes() == 1 || this.game_over == 1 )
			{
				this.scoreYes = 1

				this.Game_Over()
			}
			else{
				this.level = this.level+1
				//设定level和记时
				this.Game_levelCount()
				this.Game_timeCount()
			}
		}



	},
	Game_ScoreYes : function()
	{
		if(this.time <=0)
		{
			if(this.score < this.Get_Score())
			{
				this.scoreYes = 1
			}
			else{
				this.game_over = 0
				this.scoreYes = 0
			}
			return this.scoreYes
		}
		return 0


	},
	Get_Score : function()
	{
		this.level_score = this.last_level_score + this.level*5*this.level;
		this.last_level_score = this.level_score
		return this.level_score
	},
	Game_Score : function()
	{
		g_score.style.color = "red"
		g_score.innerHTML = "SCORE:" + this.score
		score.innerHTML = this.score

	},

	Game_Continue: function()
	{
		//分数更新
		this.score = this.score+1
		this.Game_Score()

		//this.game_over = 0
		//下一局
		this.Game_Design()
	},
	Game_Over : function()
	{
		clearTimeout(this.time_id)
		over_mask.style.display = 'inline'
		this.game_over = 1 //通过yes/no 游戏结束

		//时间更新
	},
	yes: function () {
		if(this.n_label == this.n_color)
		{
			this.Game_Continue()
		}
		else
		{
			this.Game_Over()
		}
	},
	no: function () {
		if(this.n_label != this.n_color)
		{
			this.Game_Continue()
		}
		else
		{
			this.Game_Over()
		}
	},
	restart : function () {
		this.score = 0
		this.scoreYes = 0
		this.Game_Score()
		g_score.style.color = "#1DB0B8"
		//下一局
		this.Game_Design()
		this.Game_levelCount()
		this.Game_timeCount()
	},


}

var game = new Game();
game.init()
	//game.addSuccessFn(success)
	//game.addFailedFn(failed)

/*
	var n_color = {
		/*
		white: 1,
		red: 2,
		green: 3,
		blue: 4,
		yellow: 5,
		purple: 6,
		black: 7,
		c_orange: 8,
		white : 0xffffff,
		red : 0xff0000,
		green : 0x00ff00,
		blue : 0x0000ff,
		yellow : 0xffff00,
		purple : 0x483D8B,
		black : 0x000000,
		orange : 0xff8c00,
		main_green: 0x1DB0B8,
		deep_green: 0x00343F,
		blank_green: 0x011935,
		/*
		properties: {
			1: {value: 0xffffff},
			2: {value: 0xff0000},
			3: {value: 0x00ff00},
			4: {value: 0x0000ff},
			5: {value: 0xffff00},
			6: {value: 0x483D8B},
			7: {value: 0x000000},
			8: {value: 0xff8c00},
		},
		*/
		/*
        white : 0xffffff,
        red : 0xff0000,
        green : 0x00ff00,
        blue : 0x0000ff,
        yellow : 0xffff00,
        purple : 0x483D8B,
        black : 0x000000,
        c_orange : 0xff8c00,*/
//	};
/*
	var fruits = {
		apple: 1,
		banana: 2,
		grape: 3,
		watermelon: 4,
		tomato: 5,
		pear: 6,
		pineapple: 7,
		cucumber: 8,
		f_orange: 9,
	};

	var shapes = {
		square: 1,
		rectangle: 2,
		circle: 3,
		star: 4,
		oval: 5,
		triangle: 6,
	};
	var toies = {
		train: 1,
		cloud: 2,
		flower: 3,
		watch: 4,
		ball: 5,
		heart: 6,
		pan: 7,
	};
	*/
	startButton.addEventListener('click', start)
	btn_yes.addEventListener('click',yes)
	btn_no.addEventListener('click',no)
	restartButton.addEventListener('click', restart)

	//游戏开始
	function start() {
		begin_mask.style.display = 'none'
		over_mask.style.display = 'none'
		game.start()
	}
	//游戏btn正确
	function yes() {
		game.yes()
	}
	function no() {
		game.no()
	}

    // 游戏重新开始，执行函数
    function restart () {
		over_mask.style.display = 'none'
		begin_mask.style.display = 'none'
        game.restart()
    }


	/*
// 游戏失败执行函数
	function failed() {
		score.innerText = game.score
		mask.style.display = 'flex'
	}


// 游戏成功，更新分数
	function success(score) {
		var scoreCurrent = document.querySelector('.score-current')
		scoreCurrent.innerText = score;
		// 记录最高分
		var record = document.querySelector('.record');
		var item = 'JUMP_KING_RECORD_SCORE';
		var itemScore = parseInt(localStorage.getItem(item) || 0);
		if (itemScore < score) {
			localStorage.setItem(item, score);
			record.innerText = score;
		} else {
			record.innerText = itemScore;
		}
	}
*/
	/*
    // 背景音乐/音效
    function audioBgm() {
        var bgm = new Audio('./src/bgm.mp3');
        bgm.volume = .05
        bgm.play();
        return bgm;
    }
    var bgm = audioBgm();

    var ActMusic = new Audio('./src/jump.mp3');
    ActMusic.volume = .05;
    ActMusic.loop = false;

    var FallMusic = new Audio('./src/fall.mp3');
    FallMusic.volume = .05;
    FallMusic.loop = false;
    */
// 禁止移动端长按弹出菜单
	document.addEventListener('contextmenu', function (e) {
		e.preventDefault();
	})


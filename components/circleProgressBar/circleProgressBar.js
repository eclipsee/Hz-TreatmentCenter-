// components/circleProgressBar/circleProgressBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    progress:Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    count: 0,//计数器，初始值为0
    maxCount: 50, // 绘制一个圆环所需的步骤 
    countTimer: null,//定时器，初始值为null
    progressTip:'0%',
    model:'',// 设备类型
  },
  ready(){
    this.data.model = wx.getSystemInfoSync().model;
    this.drawCircle('progressBg', this.getRadius(), 4, 2,'#ededed');
  },
  /**
   * 组件的方法列表
   */
  methods: {
    drawCircle: function (id, x, w, step,defColor) {
      // 使用 wx.createContext 获取绘图上下文 context  绘制彩色进度条圆环
      var context = wx.createCanvasContext(id,this);
      // 设置渐变
      var gradient = context.createLinearGradient(2 * x, x, 0);
      gradient.addColorStop(0, defColor?defColor:"#FCB077");
      gradient.addColorStop(1, defColor?defColor:"#FF4C23");
      context.setLineWidth(w);
      context.setStrokeStyle(gradient);
      context.setLineCap('round')
      context.beginPath();//开始一个新的路径
      // step 从0到2为一周
      context.arc(x, x, x-w, -Math.PI / 2, step * Math.PI*2 - Math.PI / 2, false)
      context.stroke();//对当前路径进行描边
      context.draw();
    },
    countInterval: function (id,x,w,step) {
      // 设置倒计时 定时器 假设每隔100毫秒 count递增+1，当 count递增到两倍maxCount的时候刚好是一个圆环（ step 从0到2为一周），然后改变txt值并且清除定时器
      this.countTimer = setInterval(() => {
        if (this.data.count <= this.data.maxCount * this.data.progress) {
          // 绘制彩色圆环进度条
          this.drawCircle(id, x, w, this.data.count / this.data.maxCount)
          this.data.count++;
          this.setData({
            progressTip:Math.round(this.data.count / this.data.maxCount * 100)+'%'
          })
        } else {
          this.setData({
            progressTip: this.data.progress * 100 + '%'
          });
          clearInterval(this.countTimer);
        }
      }, 10)
    },
    // 供外部调用
    drawProgress: function(){
      this.countInterval('progressBar', this.getRadius(), 4,2,this.data.progress)
    },
    // 兼容性处理
    getRadius(){
      switch(this.data.model){
        case 'iPhone 5':return 30;break;
        case 'Nexus 5':return 33;break;
        default:return 35;
      }
    }
  }
})

<!--挂号列表页面-->
<template>
  <div class="register-container">
    <Header :message="text" :showLeft="show"></Header>
    <div class="register-item" v-for="item in registerList" v-if="!miss" :key="item.ID">
      <van-cell-group v-if="item.AM">
        <van-cell v-bind:title="item.DATE" value="内容" v-bind:label="item.AMTIME" :to="{path:'/register'}">
          <template>
            <span class="van-cell-text">费用：￥{{item.Amount}}</span><br>
            <span class="van-cell-text">剩余号数：{{item.AMMOUNT}}</span>
          </template>
        </van-cell>
      </van-cell-group>
      <van-cell-group v-if="item.PM">
        <van-cell v-bind:title="item.DATE" value="内容" v-bind:label="item.PMTIME" :to="{path:'/register'}">
          <template>
            <span class="van-cell-text">费用：￥{{item.Amount}}</span><br>
            <span class="van-cell-text">剩余号数：{{item.PMMOUNT}}</span>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
    <div v-if="miss">
      <Miss></Miss>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Header from "../components/Header";
import Miss from "../components/Miss";
export default {
  name: "RegisterList",
  components: { Header, Miss },
  data() {
    return {
      text: "挂号列表",
      show: "true",
      miss: false,
      registerList: []
    };
  },
  methods: {
    getRegisterList() {
      var _this = this;
      _this.axios
        .get("/api/Register/PBRQ", {
          params: {
            KSBH: this.$route.query.ksbh,
            YSBH: this.$route.query.id,
            ZHID: 2018071800000019
          }
        })
        .then(function(res) {
          if (res.data.Ret == 0 && res.data.Data.length > 0) {
            _this.miss = false;
            _this.registerList = res.data.Data;
            let tempArr = _this.registerList;
            for (var i = 0, j = tempArr.length; i < j; i++) {
              tempArr[i].AMTIME =
                "上午:" + tempArr[i].AMStartTime + "-" + tempArr[i].AMEndTime;
              tempArr[i].DATE = tempArr[i].Days.split(" ")[0];
              tempArr[i].PMTIME =
                "下午:" + tempArr[i].PMStartTime + "-" + tempArr[i].PMEndTime;
              tempArr[i].AMMOUNT = tempArr[i].AMNum;
              tempArr[i].PMMOUNT = tempArr[i].PMNum;
            }
            _this.registerList = tempArr;
          } else {
            _this.miss = true;
          }
        });
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    }
  },
  mounted: function() {
    this.getRegisterList();
  }
};
</script>

<style scoped>
.register-list-item {
  display: block;
  height: 100%;
  border-bottom: 1px solid #ddd;
}

.register-p {
  padding: 0.06667rem 0;
}

span.register-span {
  font-size: 16px;
  width: 3.5rem;
  padding: 0 0.26667rem;
  display: inline-block;
}

span.register-span-black {
  color: #000000;
}

span.register-span-gray {
  color: #acacac;
}

i.el-icon-arrow-right.register-list-icon {
  font-size: 20px;
  top: 0.64rem;
  right: 0.13333rem;
  position: absolute;
  color: #000;
}
</style>

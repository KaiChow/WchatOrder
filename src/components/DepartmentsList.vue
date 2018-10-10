<!--科室列表页面-->
<template>
  <div class="department">
    <Header :message="text" :showLeft="show"></Header>
    <form action="/">
      <van-search
        v-model="search"
        placeholder="请输入搜索关键词"
        show-action
        v-on:input="onSearch"
      />
    </form>
    <div class="department-list" v-if="!miss">
      <van-cell-group>
        <van-cell v-for="item in departments" v-bind:title="item.KSMC" is-link
                  :to="{path:'/doctors',query:{'ksbh':item.KSBH}}"
                  :key="item.KSBH"/>
      </van-cell-group>
    </div>
    <div v-if="miss">
      <Miss></Miss>
    </div>
  </div>
</template>


<script type="text/ecmascript-6">
  import Header from '../components/Header';
  import Miss from '../components/Miss';

  export default {
    name: 'Departments',
    components: {Miss,Header},
    data() {
      return {
        text:"科室列表",
        show:"false",
        miss: false,
        search: "",
        departments: [],
        searchDepartments: [],
        tempDepartments: []
      }
    },
    methods: {
      /**
       * 获取科室名称列表
       */

      getDepartment() {
        var _this = this;
        _this.axios.get('/api/Register/ZHKS', {
          params: {
            ZHID: 2018071800000019
          }
        }).then(function (res) {
          if (res.data.Ret == 0 && res.data.Data.length > 0) {
            _this.miss = false;
            _this.departments = res.data.Data;
            _this.tempDepartments = res.data.Data;
          } else {
            _this.miss = true;
          }

        })
      },

      /**
       * 搜索输入框名称改变
       */
      onSearch() {
        this.searchDepartments = [];
        this.departments = this.tempDepartments;
        if (!this.search) {
          this.departments = this.tempDepartments;
          this.miss = false;
          return;
        }
        for (let i = 0, j = this.departments.length; i < j; i++) {
          if (this.departments[i].KSMC.indexOf(this.search) != -1) {
            this.searchDepartments.push(this.departments[i])
          }
        }
        this.departments = this.searchDepartments;
        if (this.departments.length == 0) {
          this.miss = true;
        } else {
          this.miss = false;
        }
      }
    },
    mounted: function () {
      this.getDepartment();
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  .mint-search {
    height: 1.4667rem;
  }

</style>

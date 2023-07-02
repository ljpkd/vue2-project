<template>
  <div class="pagination">
    <!-- <button>1</button>
    <span>···</span> -->

    <!-- <button>6</button>
    <button>7</button>
    <button class="active">8</button>    
    <button>9</button>
    <button>10</button>
    
    <span>···</span>
    <button>21</button>
    <button>下一页</button> -->

    <!-- <button 
    :class="{
        active:pageNo===item
    }" 
    v-for="item in totalPages" :key="item"
    v-show="item>=startEnd.start&&item<=startEnd.end"
    >{{ item }}</button>     -->
    <button @click="changeNum(pageNo-1)" :disabled="pageNo===1">上一页</button>

    <button v-show="startEnd.start>1"  @click="changeNum(1)">1</button>

    <span v-show="startEnd.start>1">···</span>

    <button
      :class="{
        active: pageNo === index + startEnd.start ,
      }"
      v-for="(item, index) in startEnd.end - startEnd.start + 1"
      :key="item"
      @click="changeNum(index + startEnd.start)"
    >
      {{ item + startEnd.start - 1 }}
    </button>

    <span v-show="totalPages-startEnd.end>1">···</span>

    <button v-show="startEnd.end<totalPages"  @click="changeNum(totalPages)">{{ totalPages }}</button>

    <button @click="changeNum(pageNo+1)" :disabled="pageNo===totalPages">下一页</button>
    
    <span>共 {{ total }} 条</span>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: ['pageSize', 'pageNo', 'total', 'totalPages', 'continues'],
  methods:{
    // 改变页码
    changeNum(num){
      this.$emit('getPageNo',num)
    }
  },
  computed: {
    startEnd() {
      let start
      let end

      // 首先判断continues 是否大于tatal，如果continues 小于total，那就展示五个，如果continues大于tatal，那就展示tatal个

      const { totalPages, continues, pageNo } = this
      // console.log(totalPages, continues)
      if (continues > totalPages) {
        // 说明total小于等于5，那就有几页展示几个
        start = 1
        end = totalPages
      } else {
        // 说明total>5，
        start = pageNo - (continues - 1) / 2
        end = pageNo + (continues - 1) / 2

        // 这个时候就要判断临界值了，因为会出现这种情况： -1 0 1 2 3

        if (start < 1) {
          ;(start = 1), (end = continues)
        }

        if (end > totalPages) {
          end = totalPages
          start = end - continues + 1
        }
      }

      return {
        start,
        end,
      }
    },
  },
}
</script>

<style lang="less" scoped>
.pagination {
  text-align: center;

  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: gray;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      cursor: not-allowed;
      background-color: #c81623;
      color: #fff;
    }
  }

  span {
    display: inline-block;
    line-height: 28px;
    font-size: 14px;
    color: gray;
    vertical-align: middle;
  }
}
</style>

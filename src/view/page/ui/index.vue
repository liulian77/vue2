<template>
    <div class="ui-box">
        <div class="ui">
            <h1>UI设计规范</h1>
            <p>适用于WEB端</p>
            <img title="深度传媒"
                src="/image/logo.png" />
        </div>
        <!-- 颜色版块 -->
        <h2>颜色</h2>
        <ul class="color-ul">
            <li>
                <span class="a1-tag">A1</span>
                <p><em>NAME</em>main-color</p>
                <p><em>HEX</em>#354052</p>
                <p><em>RGB</em>53 64 82</p>
                <p><em>USE CASE</em>主要文字</p>
            </li>
            <li>
                <span class="a2-tag">A2</span>
                <p><em>NAME</em>minor-color</p>
                <p><em>HEX</em>#7f8fa4</p>
                <p><em>RGB</em>127 143 164</p>
                <p><em>USE CASE</em>次要文字</p>
            </li>
            <li>
                <span class="a3-tag">A3</span>
                <p><em>NAME</em>grey-color</p>
                <p><em>HEX</em>#c5ccd4</p>
                <p><em>RGB</em>197 204 212</p>
                <p><em>USE CASE</em>文字置灰</p>
            </li>
            <li>
                <span class="a4-tag">A4</span>
                <p><em>NAME</em>icon-color</p>
                <p><em>HEX</em>#ebedf2</p>
                <p><em>RGB</em>235 237 242</p>
                <p><em>USE CASE</em>个别小图标</p>
            </li>
            <li>
                <span class="a5-tag">A5</span>
                <p><em>NAME</em>white-color</p>
                <p><em>HEX</em>#ffffff</p>
                <p><em>RGB</em>255 255 255</p>
                <p><em>USE CASE</em>深色背景文字</p>
            </li>
            <li>
                <span class="a6-tag">A6</span>
                <p><em>NAME</em>nav-bg-color</p>
                <p><em>HEX</em>#252e3d</p>
                <p><em>RGB</em>37 46 61</p>
                <p><em>USE CASE</em>左侧导航背景</p>
            </li>
            <li>
                <span class="a7-tag">A7</span>
                <p><em>NAME</em>border-color</p>
                <p><em>HEX</em>#dfe2e6</p>
                <p><em>RGB</em>233 226 230</p>
                <p><em>USE CASE</em>描边</p>
            </li>
            <li>
                <span class="a8-tag">A8</span>
                <p><em>NAME</em>line-color</p>
                <p><em>HEX</em>#f1f2f4</p>
                <p><em>RGB</em>241 242 244</p>
                <p><em>USE CASE</em>线</p>
            </li>
        </ul>
        <!-- 彩色 -->
        <ul class="color-ul">
            <li>
                <span class="b1-tag">B1</span>
                <p><em>NAME</em>highlight-color</p>
                <p><em>HEX</em>#2198f0</p>
                <p><em>RGB</em>33 152 240</p>
                <p><em>USE CASE</em>高亮（文字、项等）</p>
            </li>
            <li>
                <span class="b2-tag">B2</span>
                <p><em>NAME</em>success-color</p>
                <p><em>HEX</em>#44c14a</p>
                <p><em>RGB</em>68 193 74</p>
            </li>
            <li>
                <span class="b3-tag">B3</span>
                <p><em>NAME</em>warning-color</p>
                <p><em>HEX</em>#ffbb44</p>
                <p><em>RGB</em>255 187 68</p>
            </li>
            <li>
                <span class="b4-tag">B4</span>
                <p><em>NAME</em>deep-purple-color</p>
                <p><em>HEX</em>#8a5bf6</p>
                <p><em>RGB</em>138 91 246</p>
            </li>
            <li>
                <span class="b5-tag">B5</span>
                <p><em>NAME</em>purple-color</p>
                <p><em>HEX</em>#d25ee6</p>
                <p><em>RGB</em>210 94 230</p>
            </li>
            <li>
                <span class="b6-tag">B6</span>
                <p><em>NAME</em>mud-color</p>
                <p><em>HEX</em>#d18b4c</p>
                <p><em>RGB</em>209 139 76</p>
            </li>
            <li>
                <span class="b7-tag">B7</span>
                <p><em>NAME</em>blue-green-color</p>
                <p><em>HEX</em>#00c8dc</p>
                <p><em>RGB</em>0 200 220</p>
            </li>
            <li>
                <span class="b8-tag">B8</span>
                <p><em>NAME</em>green-color</p>
                <p><em>HEX</em>#4ad8ae</p>
                <p><em>RGB</em>74 216 174</p>
            </li>
            <li>
                <span class="b9-tag">B9</span>
                <p><em>NAME</em>error-color</p>
                <p><em>HEX</em>#f04040</p>
                <p><em>RGB</em>240 64 64</p>
                <p><em>USE CASE</em>错误提示文字</p>
            </li>
        </ul>
        <!-- 字体图标 -->
        <h2>字体图标</h2>
        <ul class="iconfont" >
            <li>
                <sn-icon type="username" :size="30" color="#c5ccd4"/>
                <p>username</p>
            </li>
            <li>
                <sn-icon type="password" :size="30" color="#c5ccd4"/>
                <p>password</p>
            </li>
            <li>
                <sn-icon type="ad-creativity"  :size="30" color="#c5ccd4"/>
                <p>ad-creativity</p>
            </li>
            <li>
                <sn-icon type="close"  :size="30" color="#354052"/>
                <p>close</p>
            </li>
            <li>
                <sn-icon type="drop-up" :size="30" color="#2198f0"/>
                <p>drop-up</p>
            </li>
            <li>
                <sn-icon type="drop-down"  :size="30" color="#2198f0"/>
                <p>drop-down</p>
            </li>
            <li>
                <sn-icon type="alipay-select" :size="30" color="#2198f0"/>
                <p>alipay-select</p>
            </li>
            <li>
                <sn-icon type="number-days" :size="30" color="#2198f0"/>
                <p>number-days</p>
            </li>
            <li>
                <sn-icon type="balance" :size="30" color="#44c14a"/>
                <p>balance</p>
            </li>
            <li>
                <sn-icon type="limit" :size="30" color="#fb4"/>
                <p>limit</p>
            </li>
            <li>
                <sn-icon type="download" :size="30" color="#c5ccd4" />
                <p>download</p>
            </li>
            <li>
                <sn-icon type="modify" :size="30" color="#7f8fa4"/>
                <p>modify</p>
            </li>
            <li>
                <sn-icon type="sign-out" :size="30" color="#7f8fa4"/>
                <p>sign-out</p>
            </li>
            <li>
                <sn-icon type="tips" :size="30" color="#2198f0"/>
                <p>tips</p>
            </li>
            <li>
                <sn-icon type="explain" :size="30" color="#2198f0"/>
                <p>explain</p>
            </li>
            <li>
                <sn-icon type="wechat" :size="30" color="#44c14a"/>
                <p>wechat</p>
            </li>
            <li>
                <sn-icon type="alipay" :size="30" color="#2198f0"/>
                <p>alipay</p>
            </li>
            <li>
                <sn-icon type="ad-group" :size="30" color="#c5ccd4"/>
                <p>ad-group</p>
            </li>
            <li>
                <sn-icon type="ad-plan" :size="30" color="#c5ccd4"/>
                <p>ad-plan</p>
            </li>
            <li>
                <sn-icon type="menu" :size="30" color="#354052"/>
                <p>menu</p>
            </li>
            <li>
                <sn-icon type="open" :size="30" color="#354052"/>
                <p>open</p>
            </li>
            <li>
                <sn-icon type="retract" :size="30" color="#354052"/>
                <p>retract</p>
            </li>
            <li>
                <sn-icon type="triangle-down" :size="30" color="#c5ccd4"/>
                <p>triangle-down</p>
            </li>
            <li>
                <sn-icon type="triangle-up" :size="30" color="#c5ccd4"/>
                <p>triangle-up</p>
            </li>
            <li>
                <sn-icon type="warning" :size="30" color="#fb4"/>
                <p>warning</p>
            </li>
            <li>
                <sn-icon type="error" :size="30" color="#f04040"/>
                <p>error</p>
            </li>
            <li>
                <sn-icon type="common" :size="30" color="#2198f0"/>
                <p>common</p>
            </li>
            <li>
                <sn-icon type="success" :size="30" color="#44c14a"/>
                <p>success</p>
            </li>
            <li>
                <sn-icon type="search" :size="30" color="#c5ccd4"/>
                <p>search</p>
            </li>
            <li>
                <sn-icon type="calendar" :size="30" color="#c5ccd4"/>
                <p>calendar</p>
            </li>
            <li>
                <sn-icon type="refresh" :size="30" color="#c5ccd4"/>
                <p>refresh</p>
            </li>
            <li>
                <sn-icon type="delete" :size="30" color="#c5ccd4"/>
                <p>delete</p>
            </li>
            <li>
                <sn-icon type="pause" :size="30" color="#c5ccd4"/>
                <p>pause</p>
            </li>
            <li>
                <sn-icon type="start" :size="30" color="#c5ccd4"/>
                <p>start</p>
            </li>
            <li>
                <sn-icon type="success-crude" :size="30" color="#44c14a"/>
                <p>success-crude</p>
            </li>
            <li>
                <sn-icon type="error-crude" :size="30" color="#f04040"/>
                <p>error-crude</p>
            </li>
            <li>
                <sn-icon type="radio" :size="30" color="#c5ccd4"/>
                <p>radio</p>
            </li>
            <li>
                <sn-icon type="radio-checked" :size="30" color="#2198f0"/>
                <p>radio-checked</p>
            </li>
            <li>
                <sn-icon type="checkbox-checked" :size="30" color="#2198f0"/>
                <p>checkbox-checked</p>
            </li>
            <li>
                <sn-icon type="checkbox" :size="30" color="#c5ccd4"/>
                <p>checkbox</p>
            </li>
            <li>
                <sn-icon type="arrow-down" :size="30" color="#7f8fa4"/>
                <p>arrow-down</p>
            </li>
            <li>
                <sn-icon type="arrow-left" :size="30" color="#7f8fa4"/>
                <p>arrow-left</p>
            </li>
            <li>
                <sn-icon type="finance" :size="30" color="#354052"/>
                <p>finance</p>
            </li>
            <li>
                <sn-icon type="home" :size="30" color="#354052"/>
                <p>home</p>
            </li>
            <li>
                <sn-icon type="count" :size="30" color="#354052"/>
                <p>count</p>
            </li>
            <li>
                <sn-icon type="media-dealer" :size="30" color="#354052"/>
                <p>media-dealer</p>
            </li>
            <li>
                <sn-icon type="advert" :size="30" color="#354052"/>
                <p>advert</p>
            </li>
            <li>
                <sn-icon type="media" :size="30" color="#354052"/>
                <p>media</p>
            </li>
            <li>
                <sn-icon type="advertising-creativity" :size="30" color="#354052"/>
                <p>advertising-creativity</p>
            </li>
            <li>
                <sn-icon type="flow-analysis" :size="30" color="#354052"/>
                <p>flow-analysis</p>
            </li>
            <li>
                <sn-icon type="advertising-position" :size="30" color="#354052"/>
                <p>advertising-position</p>
            </li>
        </ul>
        <!-- 字体 -->
        <h2>字体</h2>
        <div class="font">
            <sn-row :gutter="40">
                <sn-col span="12">
                <h3>中文字体</h3>
                <div class="font-height">微软雅黑</div>
                </sn-col>
                <sn-col span="12">
                <h3>数字、英文字体</h3>
                <div class="font-height">Arial</div>
                </sn-col>
            </sn-row>
            <br>
            <sn-row>
                <sn-col span="24">
                <h3>字体大小</h3>
                <div class="font-size">
                    <div>
                        <span class="ts1-tag">TS1</span> 18px
                        <p>USE CASE：数字数据</p>
                    </div>
                    <div>
                        <span class="ts2-tag">TS2</span> 16px
                        <p>USE CASE：标题字体</p>
                    </div>
                    <div>
                        <span class="ts3-tag">TS3</span> 14px
                        <p>USE CASE：常规字体</p>
                    </div>
                    <div>
                        <span class="ts3-tag">TS4</span> 12px
                        <p>USE CASE：</p>
                    </div>
                </div>
                </sn-col>
            </sn-row>
            <br>
            <sn-row>
                <sn-col span="24">
                <h3>文字样式</h3>
                <div class="table-box">
                    <table class="font-table">
                        <tr>
                            <td><span class="t-tag">T1</span></td>
                            <td><em class="t1">标准字</em></td>
                            <td><span class="a1-tag">A1</span></td>
                            <td><span class="ts1-tag">TS1</span></td>
                            <td>Bold</td>
                            <td>数字数据</td>
                            <td>如： 数字数据 如：首页、数据统计页面数字数据</td>
                        </tr>
                        <tr>
                            <td><span class="t-tag">T2</span></td>
                            <td><em class="t2">标准字</em></td>
                            <td><span class="a1-tag">A1</span></td>
                            <td><span class="ts2-tag">TS2</span></td>
                            <td>Bold</td>
                            <td>标题</td>
                            <td>如：卡片标题，数据卡片突显数字数据，搜索结果一级分类标题</td>
                        </tr>
                        <tr>
                            <td><span class="t-tag">T3</span></td>
                            <td><em class="t3">标准字</em></td>
                            <td><span class="a1-tag">A1</span></td>
                            <td><span class="ts3-tag">TS3</span></td>
                            <td>Bold</td>
                            <td>当前面包屑</td>
                            <td>如：面包屑当前位置</td>
                        </tr>
                        <tr>
                            <td><span class="t-tag">T4</span></td>
                            <td><em class="t4">标准字</em></td>
                            <td><span class="a1-tag">A1</span></td>
                            <td><span class="ts3-tag">TS3</span></td>
                            <td>Regular</td>
                            <td>主要文字</td>
                            <td>如：各种列表数据内容，输入框输入文字等</td>
                        </tr>
                        <tr>
                            <td><span class="t-tag">T5</span></td>
                            <td><em class="t5">标准字</em></td>
                            <td><span class="a2-tag">A2</span></td>
                            <td><span class="ts3-tag">TS3</span></td>
                            <td>Regular</td>
                            <td>次要文字</td>
                            <td>如：各种列表表头文字，说明性文字，导航栏文字等</td>
                        </tr>
                        <tr>
                            <td><span class="t-tag">T6</span></td>
                            <td><em class="t6">标准字</em></td>
                            <td><span class="a3-tag">A3</span></td>
                            <td><span class="ts3-tag">TS3</span></td>
                            <td>Regular</td>
                            <td>提示文字</td>
                            <td>如：各种输入框未输入时的提示文字，置灰不可以用字体</td>
                        </tr>
                        <tr>
                            <td><span class="t-tag">T7</span></td>
                            <td><em class="t7">标准字</em></td>
                            <td><span class="b1-tag">B1</span></td>
                            <td><span class="ts3-tag">TS3</span></td>
                            <td>Regular</td>
                            <td>高亮文字</td>
                            <td>如：数据趋势图选中日期，搜索结果匹配文字</td>
                        </tr>
                        <tr>
                            <td><span class="t-tag">T8</span></td>
                            <td><em class="t8">标准字</em></td>
                            <td><span class="b9-tag">B9</span></td>
                            <td><span class="ts3-tag">TS3</span></td>
                            <td>Regular</td>
                            <td>错误提示</td>
                            <td>如：输入框输入错误提示，审核未通过文字</td>
                        </tr>
                        <tr>
                            <td><span class="t-tag">T9</span></td>
                            <td><em class="t9">标准字</em></td>
                            <td><span class="a5-tag">A5</span></td>
                            <td><span class="ts3-tag">TS3</span></td>
                            <td>Regular</td>
                            <td>深色背景文字</td>
                            <td>如：蓝色按钮文字</td>
                        </tr>
                    </table>
                </div>
                </sn-col>
            </sn-row>
        </div>
        <!-- 尺寸 -->
        <h2>尺寸</h2>
        <div class="size-box">
            <h3>圆角</h3>
            <div class="border-radius-item">
                2px 按钮+下拉框
            </div>
            <div class="border-radius-item">
                4px 大背景+卡片
            </div>
            <h3>间距</h3>
            <u class="line-height">
                <li>
                    <p>60px</p>
                    <span></span>
                    <span></span>
                </li>
                <li>
                    <p>40px</p>
                    <span></span>
                    <span></span>
                </li>
                <li>
                    <p>30px</p>
                    <span></span>
                    <span></span>
                </li>
                <li>
                    <p>25px</p>
                    <span></span>
                    <span></span>
                </li>
                <li>
                    <p>20px</p>
                    <span></span>
                    <span></span>
                </li>
                <li>
                    <p>10px</p>
                    <span></span>
                    <span></span>
                </li>
            </u>
        </div>
        <!-- 尺寸 -->
        <h2>控件</h2>
        <sn-row>
            <sn-col span="24">
            <h3>按钮</h3>
            <div class="btn-bg">
                <h4>默认按钮（固定宽高）</h4>
                <sn-button>按钮</sn-button>
                <sn-button type="primary">按钮</sn-button>
                <h4>镂空按钮（宽度内容定）</h4>
                <sn-button type="primary"
                    size="stretch"
                    ghost>按钮</sn-button>
                <sn-button type="error"
                    size="stretch"
                    ghost>按钮</sn-button>
                <sn-button type="success"
                    size="stretch"
                    ghost>按钮</sn-button>
                <sn-button type="primary"
                    size="stretch">按钮</sn-button>
                <h4>小尺寸圆角按钮（固定宽高）</h4>
                <sn-button type="primary"
                    size="small"
                    shape="circle">按钮</sn-button>
                <h4>满屏大按钮</h4>
                <sn-button type="primary"
                    size="large" shape="circle">按钮</sn-button>
            </div>
            </sn-col>
        </sn-row>
        <br>
        <sn-row>
            <sn-col span="24">
            <h3>选择</h3>
            <div class="btn-bg">
                <h4>单选</h4>
                <sn-radio-group v-model="RadioGroup">
                    <sn-radio label="one">1</sn-radio>
                    <sn-radio label="two">2</sn-radio>
                    <sn-radio label="tree">3</sn-radio>
                </sn-radio-group>
                <span class="ml20">选中{{RadioGroup}}</span>
                <h4>多选</h4>
                <sn-checkbox-group  v-model="CheckboxGroup">
                    <sn-checkbox :value="1">111</sn-checkbox>
                    <sn-checkbox :value="2">222</sn-checkbox>
                    <sn-checkbox :value="3">333</sn-checkbox>
                </sn-checkbox-group>
                <span class="ml20">选中{{CheckboxGroup}}</span>
            </div>
            </sn-col>
        </sn-row>
        <br>
        <sn-row>
            <sn-col span="24">
            <h3>输入框</h3>
                <div>
                    <sn-input placeholder="请输入" style="width: 360px" v-model="input">
                        <sn-icon type="search"
                              color="#ebedf2"
                              :size="15"
                              class="icon"
                              slot="prefix"
                        />
                    </sn-input>
                    <span class="ml20">{{input}}</span>
                </div>
            </sn-col>
        </sn-row>
        <br>
        <sn-row>
            <sn-col span="24">
            <h3>搜索</h3>
                <div>
                    <sn-search
                            :width="270"
                            :items="data"
                            showName="label"
                            :pretext="'请输入搜索关键字'"
                            :Level="true"
                    ></sn-search>

                    <sn-level-search :width="300"
                                 :placeholder="'请选择'"
                                 v-model="data4"
                                 :searchItems="searchItems"
                                 style="margin-left: 20px;"
                    >
                        <sn-level-search-item
                                title="广告计划"
                                :items="cityList1"
                                :button="true"
                                v-model="data1"
                        ></sn-level-search-item>
                        <sn-level-search-item
                                :items="cityList2"
                                title="广告组"
                                v-model="data2"
                                :styles="{'transform':'translate(100%,100%)','margin-left':'10px'}"
                        ></sn-level-search-item>
                        <sn-level-search-item
                                title="广告创意"
                                :items="cityList3"
                                v-model="data3"
                                :styles="{'transform':'translate(200%,100%)','margin-left':'20px'}"
                                :triangle="false"
                        ></sn-level-search-item>
                    </sn-level-search>

                    <sn-level-checkbox
                            :width="300"
                            :placeholder="'请选择'"
                            v-model="data"
                            style="margin-left: 20px;"
                    >
                        <sn-level-checkbox-item
                                :items="cityList4"
                                :button="true"
                                v-model="data1"
                        ></sn-level-checkbox-item>
                        <sn-level-checkbox-item
                                :items="cityList5"
                                v-model="data2"
                                :styles="{'transform':'translate(100%,100%)','margin-left':'10px'}"
                                :triangle="false"
                        ></sn-level-checkbox-item>
                    </sn-level-checkbox>
                </div>
            </sn-col>
        </sn-row>
        <br>
        <sn-row>
            <sn-col span="24">
            <h3>下拉选框</h3>
                <div class="flex">
                    <sn-select
                            :width="360"
                            :border="true"
                            :search="true"
                            :level="true"
                            placeholder="选择类别"
                            v-model="selectValue"
                            @change="selectChange"
                    >
                        <template v-for="item in select" :value="item">
                            <sn-option :value="item.label" type="title" :disabled="true">{{item.label}}</sn-option>
                            <sn-option :value="val.label" v-for="val in item.children">{{val.label}}</sn-option>
                        </template>
                    </sn-select>
                </div>
            </sn-col>
        </sn-row>
        <br>
        <sn-row>
            <sn-col span="24">
            <h3>页码</h3>
            <div class="btn-bg">
                <sn-page :total="100"
                        :current="1"
                        :page-size="10"
                        show-sizer
                        show-elevator
                        show-total
                        placement="top"
                        @on-change="onChange"
                        @on-page-size-change="onPageSizeChange"
                >
                </sn-page>
            </div>
            </sn-col>
        </sn-row>
        <br>
        <sn-row>
            <sn-col span="24">
            <h3>开关</h3>
            <div class="btn-bg">
                <sn-switch :value="true" /> <sn-switch style="margin-left: 40px;"/>
            </div>
            </sn-col>
        </sn-row>
        <br>
        <sn-row>
            <sn-col span="24">
            <h3>Tab切换</h3>
            <div class="btn-bg">
                <sn-tabs type="card">
                    <sn-tab-pane label="选中">第一个</sn-tab-pane>
                    <sn-tab-pane label="未选中">第二个</sn-tab-pane>
                    <sn-tab-pane label="未选中">第三个</sn-tab-pane>
                </sn-tabs>
            </div>
            </sn-col>
        </sn-row>
        <br>
        <sn-row>
            <sn-col span="24">
            <h3>弹窗</h3>
            <div class="btn-bg">
                <sn-button @click.native="openDialog('default','普通弹窗提示，这里是普通弹窗提示文案！')" size="stretch" >点击打开普通弹窗</sn-button>
                <sn-button @click.native="openDialog('warning','警示弹窗提示，这里是警示弹窗提示文案！')" size="stretch" class="ml20">点击打开警示弹窗</sn-button>
                <sn-button @click.native="openDialog('error','警示错误提示，这里是错误弹窗提示文案！')" size="stretch" class="ml20">点击打开错误弹窗</sn-button>
            </div>
            </sn-col>
        </sn-row>
        <sn-row>
            <sn-col span="24">
            <h3>Loading</h3>
            <div class="btn-bg">
                <Loading :visible="true"></Loading>
            </div>
            </sn-col>
        </sn-row>
        <br>
        <sn-row>
            <sn-col span="24">
            <h3>日期</h3>
            <div class="btn-bg">
                <sn-date-picker type="daterange"
                    :options="options1"
                    :confirm="confirm"
                    placement="top-start"
                    placeholder="选择日期"
                    style="width: 274px"></sn-date-picker>

            </div>
            </sn-col>
        </sn-row>
        <br>
    </div>
</template>
<script>
import {Icon, Button, Input, Select, Option, Search, SnPage, Switch, Checkbox, CheckboxGroup, Radio, RadioGroup, LevelSearch, LevelSearchItem, LevelCheckbox, LevelCheckboxItem} from '_c'
import { Row,Tabs,TabPane,DatePicker,Col } from 'iview';
import { Dialog } from '_c/dialog'
export default {
  components: {
    'sn-switch':Switch,
    'sn-option':Option,
    'sn-page':SnPage,
    'sn-level-checkbox':LevelCheckbox,
    'sn-level-checkbox-item':LevelCheckboxItem,
    'sn-level-search':LevelSearch,
    'sn-level-search-item':LevelSearchItem,
    'sn-search':Search,
    'sn-select':Select,
    'sn-input':Input,
    'sn-radio':Radio,
    'sn-radio-group':RadioGroup,
    'sn-checkbox':Checkbox,
    'sn-checkbox-group':CheckboxGroup,
    'sn-icon':Icon,
    'sn-col':Col,
    'sn-date-picker':DatePicker,
    'sn-button':Button,
    'sn-tabs':Tabs,
    'sn-tab-pane':TabPane,
    'sn-row':Row,
  },
  data() {
    return {
      DialogType:'default',
      visible:false,
      page:{
            count: 112,//总数据量
            current: 1,//当前页
            length: 20,//初始每页行数
            lengthMenu: [10, 20, 50, 100],//每页显示行数列表
            start: 0,//起始行
            end: 0,//结束行
            pages: 20,//总页数
            showPages: 5,//展示页码量,最小为3
        },
      RadioGroup:'',
      CheckboxGroup:[1, 2],
      input:'',
      select: [
            {
            label: '媒体商',
            children: [{
                label: '腾讯视频VIP',
            },{
                label: '腾讯视频推广广告',
            }]},
            {
                label: '媒体',
                children: [{
                    label: '视频互动腾讯',
                }],},
            {
                label: '广告位',
                children: [{
                    label: '腾讯视频'
                }]
            }],
      selectValue:'',

      options1: {
        shortcuts: [
          {
            text: "今天",
            value() {
              const start = new Date();
              const end = new Date();
              return [start, end];
            }
          },
          {
            text: "昨天",
            value() {
              const start = new Date();
              const end = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              end.setTime(end.getTime() - 3600 * 1000 * 24);
              return [start, end];
            }
          },
          {
            text: "最近7天",
            value() {
              const start = new Date();
              const end = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              return [start, end];
            }
          },
          {
            text: "最近30天",
            value() {
              const start = new Date();
              const end = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              return [start, end];
            }
          },
          {
            text: "本月",
            value() {
              const start = new Date();
              const end = new Date();
              start.setTime(start.setDate(1));
              return [start, end];
            }
          },
          {
            text: "上月",
            value() {
              var start = new Date();
              const end = new Date();
              var now = new Date();
              now.setDate(1);
              now.setHours(0, 0, 0, 0);
              var time = now.getTime() - 1;
              end.setTime(now.setTime(time));
              start.setTime(now.setDate(1));
              return [start, end];
            }
          }
        ]
      },
      confirm: true,
      open:true,
      data: [
          {
            label: '媒体商',
            children: [{
                label: '腾讯视频VIP',
            },{
                label: '腾讯视频推广广告',
            }]},
            {
                label: '媒体',
                children: [{
                    label: '视频互动腾讯',
                }],},
            {
                label: '广告位',
                children: [{
                    label: '腾讯视频'
                }]
        }],
      cityList1: [
            {
                value: 'New York',
                label: '腾讯推广',
                children: [{
                    label: '三级 1-1-1'
                }]
            },
            {
                value: '腾讯推广腾讯推广',
                label: '百度互娱',
                children: [{
                    label: '三级 1-1-1'
                }]
            },
            {
                value: '百度互娱',
                label: '生活服务',
                children: [{
                    label: '三级 1-1-1'
                }]
            },
            {
                value: '交通出行',
                label: '教育'
            },
            {
                value: 'Paris',
                label: '交通出行',
                children: [{
                    label: '三级 1-1-1'
                }]
            },
            {
                value: 'Canberra',
                label: '电商'
            },
            {
                value: 'London',
                label: '财务'
            },
            {
                value: 'Sydney',
                label: '商务'
            },
            {
                value: 'Ottawa',
                label: 'Ottawa'
            },
            {
                value: 'Paris',
                label: 'Paris'
            },
            {
                value: 'Canberra',
                label: 'Canberra'
            },
            {
                value: 'London',
                label: 'London'
            },
            {
                value: 'Sydney',
                label: 'Sydney'
            },
            {
                value: 'Ottawa',
                label: 'Ottawa'
            },
            {
                value: 'Paris',
                label: 'Paris'
            },
            {
                value: 'Canberra',
                label: 'Canberra'
            },
            {
                value: 'London',
                label: 'London'
            },
            {
                value: 'Sydney',
                label: 'Sydney'
            },
            {
                value: 'Ottawa',
                label: 'Ottawa'
            },
            {
                value: 'Paris',
                label: 'Paris'
            },
            {
                value: 'Canberra',
                label: 'Canberra'
            },
            {
                value: 'London',
                label: 'London'
            },
            {
                value: 'Sydney',
                label: 'Sydney'
            },
            {
                value: 'Ottawa',
                label: 'Ottawa'
            },
            {
                value: 'Paris',
                label: 'Paris'
            },
            {
                value: 'Canberra',
                label: 'Canberra'
            },
            {
                value: 'London',
                label: 'London'
            },
            {
                value: 'Sydney',
                label: 'Sydney'
            },
            {
                value: 'Ottawa',
                label: 'Ottawa'
            },
            {
                value: 'Paris',
                label: 'Paris'
            },
            {
                value: 'Canberra',
                label: 'Canberra'
            }
        ],
      cityList2: [
            {
                value: 'New York',
                label: '汽车',
                children: [{
                    label: '三级 1-1-1'
                }]
            },
            {
                value: '腾讯推广腾讯推广',
                label: '百度互娱',
                children: [{
                    label: '三级 1-1-1'
                }]
            },
            {
                value: '百度互娱',
                label: '生活服务',
                children: [{
                    label: '三级 1-1-1'
                }]
            },
            {
                value: '交通出行',
                label: '教育'
            },
            {
                value: 'Paris',
                label: '交通出行',
                children: [{
                    label: '三级 1-1-1'
                }]
            },
            {
                value: 'Canberra',
                label: '电商'
            },
            {
                value: 'London',
                label: '财务'
            },
            {
                value: 'Sydney',
                label: '商务'
            },
            {
                value: 'Ottawa',
                label: 'Ottawa'
            },
            {
                value: 'Paris',
                label: 'Paris'
            },
            {
                value: 'Canberra',
                label: 'Canberra'
            },
            {
                value: 'London',
                label: 'London'
            },
            {
                value: 'Sydney',
                label: 'Sydney'
            },
            {
                value: 'Ottawa',
                label: 'Ottawa'
            },
            {
                value: 'Paris',
                label: 'Paris'
            },
            {
                value: 'Canberra',
                label: 'Canberra'
            },
            {
                value: 'London',
                label: 'London'
            },
            {
                value: 'Sydney',
                label: 'Sydney'
            },
            {
                value: 'Ottawa',
                label: 'Ottawa'
            },
            {
                value: 'Paris',
                label: 'Paris'
            },
            {
                value: 'Canberra',
                label: 'Canberra'
            },
            {
                value: 'London',
                label: 'London'
            },
            {
                value: 'Sydney',
                label: 'Sydney'
            },
            {
                value: 'Ottawa',
                label: 'Ottawa'
            },
            {
                value: 'Paris',
                label: 'Paris'
            },
            {
                value: 'Canberra',
                label: 'Canberra'
            },
            {
                value: 'London',
                label: 'London'
            },
            {
                value: 'Sydney',
                label: 'Sydney'
            },
            {
                value: 'Ottawa',
                label: 'Ottawa'
            },
            {
                value: 'Paris',
                label: 'Paris'
            },
            {
                value: 'Canberra',
                label: 'Canberra'
            }
        ],
      cityList3: [
            {
                value: 'New York',
                label: '店铺',
                children: [{
                    label: '三级 1-1-1'
                }]
            },
            {
                value: '腾讯推广腾讯推广',
                label: '百度互娱',
                children: [{
                    label: '三级 1-1-1'
                }]
            },
            {
                value: '百度互娱',
                label: '生活服务',
                children: [{
                    label: '三级 1-1-1'
                }]
            },
            {
                value: '交通出行',
                label: '教育'
            },
            {
                value: 'Paris',
                label: '交通出行',
                children: [{
                    label: '三级 1-1-1'
                }]
            },
            {
                value: 'Canberra',
                label: '电商'
            },
            {
                value: 'London',
                label: '财务'
            },
            {
                value: 'Sydney',
                label: '商务'
            },
            {
                value: 'Ottawa',
                label: 'Ottawa'
            },
            {
                value: 'Paris',
                label: 'Paris'
            },
            {
                value: 'Canberra',
                label: 'Canberra'
            },
            {
                value: 'London',
                label: 'London'
            },
            {
                value: 'Sydney',
                label: 'Sydney'
            },
            {
                value: 'Ottawa',
                label: 'Ottawa'
            },
            {
                value: 'Paris',
                label: 'Paris'
            },
            {
                value: 'Canberra',
                label: 'Canberra'
            },
            {
                value: 'London',
                label: 'London'
            },
            {
                value: 'Sydney',
                label: 'Sydney'
            },
            {
                value: 'Ottawa',
                label: 'Ottawa'
            },
            {
                value: 'Paris',
                label: 'Paris'
            },
            {
                value: 'Canberra',
                label: 'Canberra'
            },
            {
                value: 'London',
                label: 'London'
            },
            {
                value: 'Sydney',
                label: 'Sydney'
            },
            {
                value: 'Ottawa',
                label: 'Ottawa'
            },
            {
                value: 'Paris',
                label: 'Paris'
            },
            {
                value: 'Canberra',
                label: 'Canberra'
            },
            {
                value: 'London',
                label: 'London'
            },
            {
                value: 'Sydney',
                label: 'Sydney'
            },
            {
                value: 'Ottawa',
                label: 'Ottawa'
            },
            {
                value: 'Paris',
                label: 'Paris'
            },
            {
                value: 'Canberra',
                label: 'Canberra'
            }
        ],
      cityList4: [
            {
                value: 'New York',
                label: '娱乐',
                children: [{
                    label: '三级 1-1-1'
                }]
            },
            {
                value: '腾讯推广腾讯推广',
                label: '房产',
                children: [{
                    label: '三级 1-1-1'
                }]
            },
            {
                value: '百度互娱',
                label: '生活服务',
                children: [{
                    label: '三级 1-1-1'
                }]
            },
            {
                value: '交通出行',
                label: '教育'
            },
            {
                value: 'Paris',
                label: '交通出行',
                children: [{
                    label: '三级 1-1-1'
                }]
            },
            {
                value: 'Canberra',
                label: '电商'
            },
            {
                value: 'London',
                label: '财务'
            },
            {
                value: 'Sydney',
                label: '商务'
            },
            {
                value: 'Ottawa',
                label: 'Ottawa'
            },
            {
                value: 'Paris',
                label: 'Paris'
            },
            {
                value: 'Canberra',
                label: 'Canberra'
            },
            {
                value: 'London',
                label: 'London'
            },
            {
                value: 'Sydney',
                label: 'Sydney'
            },
            {
                value: 'Ottawa',
                label: 'Ottawa'
            },
            {
                value: 'Paris',
                label: 'Paris'
            },
            {
                value: 'Canberra',
                label: 'Canberra'
            },
            {
                value: 'London',
                label: 'London'
            },
            {
                value: 'Sydney',
                label: 'Sydney'
            },
            {
                value: 'Ottawa',
                label: 'Ottawa'
            },
            {
                value: 'Paris',
                label: 'Paris'
            },
            {
                value: 'Canberra',
                label: 'Canberra'
            },
            {
                value: 'London',
                label: 'London'
            },
            {
                value: 'Sydney',
                label: 'Sydney'
            },
            {
                value: 'Ottawa',
                label: 'Ottawa'
            },
            {
                value: 'Paris',
                label: 'Paris'
            },
            {
                value: 'Canberra',
                label: 'Canberra'
            },
            {
                value: 'London',
                label: 'London'
            },
            {
                value: 'Sydney',
                label: 'Sydney'
            },
            {
                value: 'Ottawa',
                label: 'Ottawa'
            },
            {
                value: 'Paris',
                label: 'Paris'
            },
            {
                value: 'Canberra',
                label: 'Canberra'
            }
        ],
      cityList5: [
            {
                value: 'New York',
                label: '丽人',
                children: [{
                    label: '三级 1-1-1'
                }]
            },
            {
                value: '腾讯推广腾讯推广',
                label: '家政',
                children: [{
                    label: '三级 1-1-1'
                }]
            },
            {
                value: '百度互娱',
                label: '宠物',
                children: [{
                    label: '三级 1-1-1'
                }]
            },
            {
                value: '交通出行',
                label: '医疗'
            },
            {
                value: 'Paris',
                label: '求职招聘',
                children: [{
                    label: '三级 1-1-1'
                }]
            },
            {
                value: 'Canberra',
                label: '餐饮美食'
            },
            {
                value: 'London',
                label: '运动健身'
            },
            {
                value: 'Sydney',
                label: '婚恋'
            },
            {
                value: 'Ottawa',
                label: '物流运输'
            },
            {
                value: 'Paris',
                label: 'Paris'
            },
            {
                value: 'Canberra',
                label: 'Canberra'
            },
            {
                value: 'London',
                label: 'London'
            },
            {
                value: 'Sydney',
                label: 'Sydney'
            },
            {
                value: 'Ottawa',
                label: 'Ottawa'
            },
            {
                value: 'Paris',
                label: 'Paris'
            },
            {
                value: 'Canberra',
                label: 'Canberra'
            },
            {
                value: 'London',
                label: 'London'
            },
            {
                value: 'Sydney',
                label: 'Sydney'
            },
            {
                value: 'Ottawa',
                label: 'Ottawa'
            },
            {
                value: 'Paris',
                label: 'Paris'
            },
            {
                value: 'Canberra',
                label: 'Canberra'
            },
            {
                value: 'London',
                label: 'London'
            },
            {
                value: 'Sydney',
                label: 'Sydney'
            },
            {
                value: 'Ottawa',
                label: 'Ottawa'
            },
            {
                value: 'Paris',
                label: 'Paris'
            },
            {
                value: 'Canberra',
                label: 'Canberra'
            },
            {
                value: 'London',
                label: 'London'
            },
            {
                value: 'Sydney',
                label: 'Sydney'
            },
            {
                value: 'Ottawa',
                label: 'Ottawa'
            },
            {
                value: 'Paris',
                label: 'Paris'
            },
            {
                value: 'Canberra',
                label: 'Canberra'
            }
        ],
      data1:'',
      data2:'',
      data3:'',
      data4:'腾讯推广/汽车/教育',
      searchItems:[{label:'媒体商A/可口可乐/食品美食'},
            {label:'媒体商B/可口可乐/食品美食'},
            {label:'媒体商C/可口可乐/食品美食'}],
      selectItem:[
            {
                value: 'New York',
                label: '深度传媒娱乐',
            },
            {
                value: '腾讯推广腾讯推广',
                label: '传媒游戏平台深度',
            },
            {
                value: '百度互娱',
                label: '深度定制SVIP',
            },
            {
                value: '深度技术',
                label: '深度技术'
            }
        ]
    };
  },
  methods:{
      openDialog(type,text){
          Dialog({
              type,
              text,
              onConfirm(){
                 alert('你点了确定');
              },
              onCancel(){
                  alert('你点了取消');
              }})
      },
      selectChange(val){
          console.log(`选中-${val}`);
      },
      onChange(val){
          console.log(`选中-${val}页`);
      },
      onPageSizeChange(val){
          console.log(`一页显示-${val}条`);
      }
  },
};
</script>

<style lang="less" scoped>

.flex{
    display: flex;
}
// 各种标签
.ts1-tag,
.ts2-tag,
.ts3-tag {
  display: inline-block;
  .line-height(24px);
  padding: 0 10px;
  background: @main-color;
  border-radius: 12px;
  color: @white-color;
}
.ts2-tag {
  background: @minor-color;
}
.ts3-tag {
  background: @grey-color;
}
.a1-tag,
.a2-tag,
.a3-tag,
.a4-tag,
.a5-tag,
.a6-tag,
.a7-tag,
.a8-tag,
.b1-tag,
.b2-tag,
.b3-tag,
.b4-tag,
.b5-tag,
.b6-tag,
.b7-tag,
.b8-tag,
.b9-tag {
  display: inline-block;
  width: 30px;
  .line-height(30px);
  background: @main-color;
  border: @main-color 1px solid;
  border-radius: 100%;
  text-align: center;
  font-size: @font-size;
  color: @white-color;
}
.a2-tag {
  background: @minor-color;
  border-color: @minor-color;
}
.a3-tag {
  background: @grey-color;
  border-color: @grey-color;
}
.a4-tag {
  background: @icon-color;
  border-color: @grey-color;
  color: @main-color;
}
.a5-tag {
  background: @white-color;
  border-color: @grey-color;
  color: @main-color;
}
.a6-tag {
  background: @nav-bg-color;
  border-color: @nav-bg-color;
}
.a7-tag {
  background: @border-color;
  border-color: @border-color;
  color: @main-color;
}
.a8-tag {
  background: @line-color;
  border-color: @border-color;
  color: @main-color;
}
.b1-tag {
  background: @highlight-color;
  border-color: @highlight-color;
}
.b2-tag {
  background: @success-color;
  border-color: @success-color;
}
.b3-tag {
  background: @warning-color;
  border-color: @warning-color;
}
.b4-tag {
  background: @deep-purple-color;
  border-color: @deep-purple-color;
}
.b5-tag {
  background: @purple-color;
  border-color: @purple-color;
}
.b6-tag {
  background: @mud-color;
  border-color: @mud-color;
}
.b7-tag {
  background: @blue-green-color;
  border-color: @blue-green-color;
}
.b8-tag {
  background: @green-color;
  border-color: @green-color;
}
.b9-tag {
  background: @error-color;
  border-color: @error-color;
}
.t-tag {
  display: inline-block;
  width: 50px;
  .line-height(24px);
  text-align: center;
  background: @deep-purple-color;
  color: @white-color;
  border-radius: @border-radius;
}
.white-bg {
  background: @white-color;
  border-radius: @border-radius-l;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}
//
.ui-box {
  padding: 30px;
  font-size: @font-size;
}
.ui {
  text-align: center;
  h1 {
    font-size: 40px;
    font-weight: @font-lighter;
  }
  p {
    margin: 9px 0 30px;
    font-size: @font-size;
  }
}
h2 {
  margin: 40px 0 25px;
  font-weight: @font-lighter;
  font-size: 40px;
}
h3 {
  margin-bottom: 10px;
}
.color-ul {
  display: flex;
  flex-wrap: wrap;
  li {
    float: left;
    flex: 0 1 16.66667%;
    margin: 20px 0;
    min-width: 220px;
    span {
      display: block;
      width: 70px;
      .line-height(70px);
      margin: 0 0 15px 15px;
      font-size: 20px;
      font-weight: bold;
    }
    p {
      line-height: 2;
      em {
        display: inline-block;
        width: 5em;
        margin-right: 30px;
        text-align: right;
        color: @grey-color;
      }
    }
  }
}
.iconfont {
  display: flex;
  flex-wrap: wrap;
  li {
    flex: 0 1 12.5%;
    margin: 20px 0;
    min-width: 105px;
    text-align: center;
  }
}
.font {
  .ivu-row {
    margin: 30px 0;
  }
  .font-height {
    line-height: 100px;
    text-align: center;
    font-size: 30px;
  }
  .ivu-col {
    & > div {
      .white-bg();
    }
  }
}
.font-size {
  display: flex;
  & > div {
    flex: 1;
    padding: 30px;
    p {
      margin-top: 10px;
      color: @grey-color;
    }
    span {
      margin-right: 5px;
    }
  }
}
.table-box {
  overflow-x: auto;
}
.font-table {
  width: 100%;
  min-width: 970px;
  tr {
    td {
      padding: 0 10px;
      line-height: 70px;
      &:first-child {
        text-align: center;
      }
      &:last-child {
        color: @grey-color;
      }
    }
    &:last-child {
      background: @main-color;
      td {
        line-height: 90px;
        color: @white-color;
        &:last-child {
          color: @grey-color;
        }
      }
    }
  }
}
.size-box {
  h3:not(:first-of-type) {
    margin-top: 40px;
  }
  .border-radius-item {
    display: inline-block;
    width: 160px;
    .line-height(40px);
    margin-right: @space-xl;
    .white-bg();
    text-align: center;
    &:first-of-type {
      border-radius: @border-radius;
    }
  }
  .line-height {
    li {
      display: inline-block;
      width: @space-xl;
      margin-right: @space-xl;
      p {
        margin-bottom: 5px;
        color: @error-color;
      }
      span {
        display: block;
        width: 100%;
        height: 10px;
        background: @main-color;
        border-radius: @border-radius;
        &:first-of-type {
          margin-bottom: @space;
        }
      }
      &:nth-child(1) {
        span:first-of-type {
          margin-bottom: @space-xl;
        }
      }
      &:nth-child(2) {
        span:first-of-type {
          margin-bottom: @space-l;
        }
      }
      &:nth-child(4) {
        span:first-of-type {
          margin-bottom: @space-s;
        }
      }
      &:nth-child(5) {
        span:first-of-type {
          margin-bottom: @space-xs;
        }
      }
      &:nth-child(6) {
        span:first-of-type {
          margin-bottom: @space-xxs;
        }
      }
    }
  }
}
.btn-bg {
  .white-bg;
  padding: 30px;
  h4 {
    margin-bottom: 10px;
    &:not(:first-child) {
      margin-top: 20px;
    }
  }
  .s-btn {
    margin-right: 20px;
  }
    .ml20{
        margin-left: 20px;
    }
}
</style>


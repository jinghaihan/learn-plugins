import Vue from 'vue'
import {
  ConfigProvider,
  Select,
  Upload,
  Button,
  Icon,
  Progress,
  Row,
  Col,
  Card,
  Modal,
  Spin,
  Tooltip,
  Pagination,
  notification
} from 'ant-design-vue'

Vue.prototype.$notification = notification
Vue.prototype.$confirm = Modal.confirm

Vue.use(ConfigProvider)
Vue.use(Select)
Vue.use(Upload)
Vue.use(Button)
Vue.use(Icon)
Vue.use(Progress)
Vue.use(Row)
Vue.use(Col)
Vue.use(Card)
Vue.use(Modal)
Vue.use(Spin)
Vue.use(Tooltip)
Vue.use(Pagination)

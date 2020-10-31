<template>
  <el-card class="login-window ">
    <div slot="header" style="padding:0">
      <span
        ><i class="mr-nouo" style="font-size:100px;color: #409EFF"></i
      ></span>
    </div>
    <el-form :model="form" ref="loginForm" :rules="rules">
      <el-form-item prop="username">
        <el-input
          :placeholder="$t('placeholder.username')"
          v-model="form.username"
          ref="username"
          :autofocus="true"
          @keyup.enter.native="$refs['password'].focus()"
          prefix-icon="el-icon-user"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          :placeholder="$t('placeholder.password')"
          v-model="form.password"
          ref="password"
          prefix-icon="el-icon-lock"
          @keyup.enter.native="submit"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">{{
          $t('button.login')
        }}</el-button>
        <el-button type="primary">{{ $t('button.reset') }}</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      focus: 0,
      form: {
        username: '',
        password: '',
      },
      rules: {
        username: [
          {
            type: 'string',
            required: true,
            message: this.$t('tips.username_require'),
          },
          { min: 4, max: 32, message: this.$t('tips.username_length') },
          { pattern: /^[a-zA-Z]*$/, message: this.$t('tips.username_format') },
        ],
        password: [
          {
            type: 'string',
            required: true,
            message: this.$t('tips.password_require'),
          },
          { min: 8, max: 32, message: this.$t('tips.password_length') },
        ],
      },
    }
  },
  methods: {
    submit() {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          let form = {
            platform: 'ide',
          }
          Object.assign(form, this.form)
          this.$store.dispatch('account/login', form).then(
            () => {
              this.$message({
                offset: 6,
                duration: 1500,
                message: this.$t('tips.login_success'),
                type: 'success',
                center: true,
              })
              this.$router.push('/#/')
            },
            () => {
              this.$message({
                offset: 6,
                duration: 1500,
                message: this.$t('tips.login_error'),
                type: 'error',
                center: true,
              })
            }
          )
        } else {
          return false
        }
      })
    },
  },
}
</script>

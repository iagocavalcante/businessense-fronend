<template>
  <div class="create-form">
    <h5 class="welcome">You are new here?</h5>
    <b-input
      :placeholder="'EMAIL ADRESS'"
      :name="'email'"
      :id="'email'"
      :type="'email'"
      v-model="createForm.email"
      @blur="$v.createForm.$touch()"
    />
    <ul class="ContactForm__messages" v-if="$v.createForm.email.$error">
      <li v-if="!$v.createForm.email.required">
        This field is required.
      </li>
    </ul>
    <b-input
      :placeholder="'FIRST NAME'"
      :name="'firstName'"
      :id="'firstName'"
      v-model="createForm.firstName"
      @blur="$v.createForm.$touch()"  
    />
    <ul class="ContactForm__messages" v-if="$v.createForm.firstName.$error">
      <li v-if="!$v.createForm.firstName.required">
        This field is required.
      </li>
    </ul>
    <b-input
      :placeholder="'LAST NAME'"
      :name="'lastName'"
      :id="'lastName'"
      v-model="createForm.lastName"
      @blur="$v.createForm.$touch()"
    />
    <ul class="ContactForm__messages" v-if="$v.createForm.lastName.$error">
      <li v-if="!$v.createForm.lastName.required">
        This field is required.
      </li>
    </ul>
    <b-input
      :hasIcon="true"
      :placeholder="'PASSWORD'"
      :type="'password'"
      :name="'createPassword'"
      :classIcon="'fa fa-lock'"
      :id="'createPassword'"
      v-model="createForm.createPassword"
      @blur="$v.createForm.$touch()"
    />
    <ul class="ContactForm__messages" v-if="$v.createForm.createPassword.$error">
      <li v-if="!$v.createForm.createPassword.required">
        This field is required.
      </li>
      <li v-if="!$v.createForm.minLength">
        This field must have 6 words or more.
      </li>
    </ul>
    <b-input
      :hasIcon="true"
      :placeholder="'CONFIRM PASSWORD'"
      :type="'password'"
      :name="'confirmPassword'"
      :classIcon="'fa fa-lock'"
      :id="'confirmPassword'"
      v-model="createForm.confirmPassword"
      @blur="$v.createForm.$touch()"  
    />
    <ul class="ContactForm__messages" v-if="$v.createForm.confirmPassword.$error">
      <li v-if="!$v.createForm.confirmPassword.required">
        This field is required.
      </li>
      <li v-if="!$v.createForm.confirmPassword.sameAsPassword">
        Different password
      </li>
    </ul>
    <div class="col-md-12">
      <input type="checkbox" class="form-checkbox" name="agree" id="">
      <span class="checkbox-text">
        I agree to the terms of use of busissense.
      </span>
    </div>
    <div class="col-md-12 mb-10">
      <input type="checkbox" class="form-checkbox" name="" id="">
      <span class="checkbox-text">
        I agree to receive email newsletters and contriubutions about my account.
      </span>
    </div>
    <div class="form-group">
      <button class="btn-block btn-login" @click.prevent="createUser()">
        <span v-if="!loading">
          Create
        </span>
        <i v-if="loading" class="fa fa-spinner fa-pulse fa-3x fa-fw" style="font-size:24px; color: white;"></i>
      </button>
    </div>
  </div>
</template>

<script>
import BInput from '@/components/BInput.vue'
import { email, required, minLength, sameAs } from 'vuelidate/lib/validators'
import axios from 'axios'
import { notification } from '@/support/utils/notification-mixin'

export default {
  name: 'CreateUser',
  mixins: [notification],
  components: {
    BInput
  },
  data: () => ({
    loading: false,
    createForm: {
      email: '',
      firstName: '',
      lastName: '',
      createPassword: '',
      confirmPassword: ''
    }
  }),
  methods: {
    createUser () {
      this.loading = true
      this.$v.createForm.$touch()
      // if its still pending or an error is returned do not submit
      if (this.$v.createForm.$pending || this.$v.createForm.$error) {
        this.loading = false
        return
      } 
      
      const email = this.createForm.email 
      const password = this.createForm.createPassword
      const firstname = this.createForm.firstName 
      const lastname = this.createForm.lastName
      axios.post(`${process.env.VUE_APP_HOST}/user/new`, { email, password, firstname, lastname})
        .then((response) => {
          this.loading = false
          console.log(response.data)
          if(response.data.status) {
            this.successMsg('User Created', `Now you can see your dashboard`)
            this.resetData()
            this.$v.$reset()
            const token = response.data.account.token
            const user = response.data.account
            window.localStorage.setItem('token', token)
            window.localStorage.setItem('accountId', user.ID)
            axios.defaults.headers.common['Authorization'] = token
            this.$router.push({name: 'welcome'})
          } else {
            throw new Error(response.data.message)
          }
        })
        .catch(err => {
          this.loading = true
          this.errorMsg('Create User Error', `${err}`)
        })
    },
    resetData () {
      this.createForm.email = ''
      this.createForm.firstName = '' 
      this.createForm.lastName = '' 
      this.createForm.createPassword = '' 
      this.createForm.confirmPassword = ''
    }
  },
  validations: {
    createForm: {
      email: {
        required,
        email,
      },
      firstName: {
        required,
      },
      lastName: {
        required,
      },
      createPassword: {
        required,
        minLength: minLength(6)
      },
      confirmPassword: {
        required,
        sameAsPassword: sameAs('createPassword')
      }
    }
  }
}
</script>

<style scoped>
.create-form {
  position: relative;
  width: 270px;
  padding-top: 125px;
  padding-bottom: 135px;
}

.btn-block {
  display: block;
  width: 100%;
}

.ContactForm__messages {
  list-style-type: none;
  padding-left: 0;
  color: red;
}

.btn-login {
  height: 40px;
  border-radius: 3px;
  border: 0;
  background-color: #323031;
  color: white;
}

.form-checkbox {
  position: absolute;
  top: 0;
  left: 0;
  height: 12px;
  width: 12px;
  margin-top: 4px;
  cursor: pointer;
  background: rgba(40,40,40,0.1);
  color:black;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: 1.4px solid #ffffff;
}

.form-checkbox:checked {
  background: rgba(40,40,40,0.7);
}

.form-checkbox:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

.form-checkbox:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the form-checkbox when checked */
input:checked ~ .form-checkbox:after {
  display: block;
}

.checkbox-text {
  color: #fff;
  padding-left: 10px;
  padding-top: 0;
  font-size: 12px;
}

.welcome {
  margin: 0;
  margin-bottom: 7px; 
}

h5 {
  color: #fff;
}
</style>

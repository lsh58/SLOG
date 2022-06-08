<script lang="ts">
  import {authToken} from '@/store';

  let values = {
    formEmail: '',
    formPassWord: ''
  };

  const resetValues = () => {
    values.formEmail = '';
    values.formPassWord = '';
  };

  const onLogin = async () => {
    try {
      await authToken.login(values.formEmail, values.formPassWord);
      resetValues();
    } catch (error) {
      console.log(error);
    }
  };
</script>

<!-- start main login box-->
<main class="mdl-layout__content">
  <div class="box mdl-grid mdl-grid--no-spacing mdl-shadow--2dp">
    <div class="mdl-card mdl-cell mdl-cell--12-col">
      <div class="mdl-textfield mdl-js-textfield">
        <input
          class="mdl-textfield__input"
          type="text"
          placeholder="이메일"
          bind:value={values.formEmail}
        />
      </div>
      <div class="mdl-textfield mdl-js-textfield">
        <input
          class="mdl-textfield__input"
          type="password"
          placeholder="패스워드"
          bind:value={values.formPassWord}
        />
      </div>
      <div class="mdl-card__actions btn-box">
        <a
          href="#null"
          class="mdl-button mdl-js-button mdl-js-ripple-effect"
          on:click={onLogin}>로그인</a
        >
      </div>
    </div>
  </div>
</main>
<!-- end main login box-->

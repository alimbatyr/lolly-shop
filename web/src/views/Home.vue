<template>
  <div>
    <section id="hero">
      <v-row no-gutters>
        <v-img
          :min-height="'calc(100vh - ' + $vuetify.application.top + 'px)'"
          src="@/assets/images/home_background1.png"
        >
          <v-theme-provider dark>
            <v-container fill-height>
              <v-row align="center" class="white--text mx-auto" justify="center">
                <v-col class="white--text text-center" cols="12" tag="h1">
                  <span
                    :class="[$vuetify.breakpoint.smAndDown ? 'display-1' : 'display-2']"
                    class="font-weight-light"
                  >
                    ДОБРО ПОЖАЛОВАТЬ В
                  </span>

                  <br />

                  <span
                    :class="[$vuetify.breakpoint.smAndDown ? 'display-3' : 'display-4']"
                    class="font-weight-black"
                  >
                    LOLLY.KZ
                  </span>
                </v-col>

                <v-btn class="align-self-end" fab outlined @click="$vuetify.goTo('#about-me')">
                  <v-icon>mdi-chevron-double-down</v-icon>
                </v-btn>
              </v-row>
            </v-container>
          </v-theme-provider>
        </v-img>
      </v-row>
    </section>

    <section id="about-me">
      <div class="py-12"></div>

      <v-container class="text-center">
        <h2 class="display-2 font-weight-bold mb-3">О нас</h2>

        <v-responsive class="mx-auto mb-8" width="56">
          <v-divider class="mb-1"></v-divider>

          <v-divider></v-divider>
        </v-responsive>

        <v-responsive class="mx-auto title font-weight-light mb-8" max-width="720">
          Lolly - магазин женской одежды, обуви и аксессуаров. Открытый в 2021году в городе Алматы,
          Казахстан. <br />
          <br />
          В нашем онлайн магазине вы можете привнести новый взгляд на моду и объединить совершенно
          новые и качественные образы
        </v-responsive>
      </v-container>

      <div class="py-12"></div>
    </section>

    <section id="features" class="grey lighten-3">
      <div class="py-12"></div>

      <v-container class="text-center">
        <v-responsive class="mx-auto mb-12" width="56">
          <v-divider class="mb-1"></v-divider>

          <v-divider></v-divider>
        </v-responsive>

        <v-row>
          <v-col v-for="({ icon, title, text }, i) in features" :key="i" cols="12" md="4">
            <v-card class="py-12 px-4" color="grey lighten-5" flat>
              <v-theme-provider dark>
                <div>
                  <v-avatar color="black" size="88">
                    <v-icon large v-text="icon"></v-icon>
                  </v-avatar>
                </div>
              </v-theme-provider>

              <v-card-title
                class="justify-center font-weight-black text-uppercase"
                v-text="title"
              ></v-card-title>

              <v-card-text class="subtitle-1" v-html="text"> </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-responsive class="mx-auto mt-12" width="56">
          <v-divider class="mb-1"></v-divider>

          <v-divider></v-divider>
        </v-responsive>
      </v-container>

      <div class="py-12"></div>
    </section>

    <section id="stats">
      <v-parallax
        :height="$vuetify.breakpoint.smAndDown ? 700 : 500"
        src="@/assets/images/home_parallax.jpg"
      >
        <v-container fill-height>
          <v-row class="mx-auto">
            <v-col v-for="[value, title] of stats" :key="title" cols="12" md="3">
              <div class="text-center">
                <div class="display-3 font-weight-black mb-4" v-text="value"></div>

                <div class="title font-weight-regular text-uppercase" v-text="title"></div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-parallax>
    </section>

    <section id="blog">
      <div class="py-12"></div>

      <v-container>
        <h2 class="display-2 font-weight-bold mb-3 text-uppercase text-center">Blog</h2>

        <v-responsive class="mx-auto mb-12" width="56">
          <v-divider class="mb-1"></v-divider>

          <v-divider></v-divider>
        </v-responsive>

        <v-row>
          <v-col v-for="({ src, text, title }, i) in articles" :key="i" cols="12" md="4">
            <v-img :src="src" class="mb-4" height="275" max-width="100%"></v-img>

            <h3 class="font-weight-black mb-4 text-uppercase" v-text="title"></h3>

            <div class="title font-weight-light mb-5" v-html="text"></div>
          </v-col>
        </v-row>
      </v-container>

      <div class="py-12"></div>
    </section>

    <v-sheet id="contact" color="#333333" dark tag="section" tile>
      <div class="py-12"></div>

      <v-container>
        <h2 class="display-1 font-weight-bold mb-15 text-uppercase text-center">Контакты</h2>
        <v-row class="justify-center">
          <v-col cols="auto">г.Алматы, Globus, проспект Абая, 109в, 2 этаж </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="auto">+7-776-488-28-58</v-col>
        </v-row>
        <v-row class="justify-center mt-15">
          <v-col cols="auto">
            <v-btn icon href="https://wa.me/+77764882858" target="_blank">
              <v-icon x-large>mdi-whatsapp</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn icon href="https://t.me/lollykz" target="_blank">
              <v-icon x-large>mdi-send</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn icon href="https://instagram.com/lolly.kz?igshid=YmMyMTA2M2Y=" target="_blank">
              <v-icon x-large>mdi-instagram</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn icon href="https://www.tiktok.com/@lollykz" target="_blank">
              <v-icon x-large>mdi-music-note</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>

      <div class="py-12"></div>
    </v-sheet>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {},
  data: () => ({
    articles: [
      {
        src: 'https://verilymag.com/.image/t_share/MTM1Njk1NzY5MzIyNjg5ODEw/blackonblackjpg.jpg',
        title: 'Об одежде',
        text: `Производство: Гуанчжоу, Турция <br/>
                Размерная сетка одежды <br/>
                Международный: Xs, S, M, L <br/>
                Россия(Ru): 40, 42-44, 44-46, 46-48 <br/>
                <br/>
                Размерная сетка обуви <br/>
                Россия(Ru): 36, 37, 38, 39, 40 <br/>
                США(USA): 5, 6, 7, 8, 9 <br/>
                Европа(Eu): 36, 37, 38, 39, 40`,
      },
      {
        src: 'https://www.shopsart.ru/wp-content/uploads/2020/05/dizajn-interera-magazina-odezhdy-0082.jpg',
        title: 'Бонусная система',
        text: 'При покупках онлайн и в нашем магазине действует система бонусов. За регистрацию мы начисляем 1000тг, которые можно уже использовать при первой покупке. С каждой покупки начисляем кэшбэк 5% от суммы заказа, который в дальнейшем можно использовать до 100% оплаты.',
      },
      {
        src: 'data:image/jpeg;base64,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',
        title: 'Обслуживание',
        text: 'Наш магазин всегда готов продемонстрировать товар "лицом". Чтобы лично взглянуть на предложенный ассортимент, посетите наш шоурум в Алматы. При необходимости продавцы-консультанты помогут вам составить законченный и стильный образ, обновить гардероб на сезон с учетом всех тенденций в моде или приобрести что-то в подарок. Мы работаем ежедневно с 10:00 до 22:00.',
      },
    ],
    features: [
      {
        icon: 'mdi-credit-card-outline',
        title: 'Оплата',
        text: 'Kaspi Gold </br> Kaspi Red </br> Jusan </br> Наличные',
      },
      {
        icon: 'mdi-truck-delivery',
        title: 'Доставка',
        text: 'Курьерская служба</br> Яндекс доставка</br> KazPost</br> Самовывоз',
      },
      {
        icon: 'mdi-shield-outline',
        title: 'Обмен и возврат',
        text: 'В случае, если вам не подойдет товар, у нас действует обмен и возврат в течение 14 рабочих дней со дня покупки.',
      },
    ],
    stats: [
      ['1500+', 'Довольных покупателей'],
      ['50+', 'Покупок в день'],
      ['100+', 'Товаров'],
      ['14500+', 'Подписчиков'],
    ],
  }),
};
</script>

<style></style>

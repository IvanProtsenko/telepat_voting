<template>
        <v-container id="back">
            <v-btn block large color="primary" @click="voteCreateDialog = true">Создать опрос</v-btn>
            <v-dialog v-model="voteCreateDialog" min-widdth="700" max-width="800" content-class="round">
                    <v-card v-show="count == 1" class="createVote">
                        <v-card-title id="headline" class="justify-center">Создать опрос</v-card-title>
                        <v-card-text>
                            <v-row class="voteInput">
                                <v-col cols="12">
                                    <v-text-field v-model="title" placeholder="Тема опроса"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row class="voteInput">
                                <v-col cols="12">
                                    <v-text-field class="voteText" v-model="descrDoctor" placeholder="Описание для врача"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row class="voteInput">
                                <v-col cols="12">
                                    <v-text-field class="voteText" v-model="descrPatient" placeholder="Описание для пациента"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row class="voteInput">
                                <v-col cols="6">
                                    <v-checkbox
                                        v-model="selfVote"
                                        :label="`Может ли пациент пройти самостоятельно?`"
                                    ></v-checkbox>
                                </v-col>
                                <v-col v-show="selfVote" cols="6">
                                    <v-text-field class="voteText" v-model="descrForSelfVote" placeholder="Описание для пациента"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn id="btn-cancel" text @click="clearVote">Отмена</v-btn>
                            <v-spacer></v-spacer>
                            <v-btn id="btn-add" text @click="createVote">Создать</v-btn>
                            <v-spacer></v-spacer>
                            <v-btn id="btn-add" text @click="next">К вопросу {{count}}</v-btn>
                        </v-card-actions>
                    </v-card>
                    <v-card v-show="count > 1" class="createVote">
                        
                            <v-card-title id="headline" class="justify-center">Вопрос {{count-1}}</v-card-title>
                            <v-card-text>
                                <v-radio-group v-model="questionType">
                                    <v-radio
                                        label="Вопрос с выбором ответа"
                                        value="radio"
                                    ></v-radio>
                                    <v-radio
                                        label="Вопрос с ползунком"
                                        value="slider"
                                    ></v-radio>
                                </v-radio-group>
                                <v-form ref="form">
                                    <v-row v-show="questionType == 'radio'" class="voteInput">
                                        <v-col cols="12">
                                            <v-text-field class="voteText" v-model="variant1" placeholder="Вариант 1"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row v-show="questionType == 'radio'" class="voteInput">
                                        <v-col cols="12">
                                            <v-text-field class="voteText" v-model="variant2" placeholder="Вариант 2"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-template v-show="questionType == 'radio'" v-model="variants" v-for="variant of variants" :key="variant">
                                        <v-row class="voteInput">
                                            <v-col v-if="variant < var_count" cols="11" style="display: inline-flex">
                                                <v-text-field :id="variant" class="voteText" placeholder="Добавленный вариант"></v-text-field>
                                                <v-btn @click="delVar(variant)" outlined class="delete_var">Удалить</v-btn>
                                            </v-col>
                                            <v-col v-else cols="12">
                                                <v-text-field class="voteText" @click="addVar" placeholder="Добавить вариант"></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-template>
                                </v-form>
                                <v-col v-show="questionType == 'slider'" cols="12">
                                    <v-text-field label="Количество делений" class="voteText" type="number" v-model="number"></v-text-field>
                                </v-col>
                                <v-row v-show="number > 0 && questionType == 'slider'" class="voteInput">
                                    <v-col cols="12" v-for="i in Number(number)" :key="i" style="display: inline-flex">
                                        <v-text-field class="voteText" :placeholder="'Ползунок на отметке '+i"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn id="btn-cancel" text @click="clearVote">Отмена</v-btn>
                                <v-spacer></v-spacer>
                                <v-btn id="btn-add" text @click="createVote">Создать</v-btn>
                                <v-spacer></v-spacer>
                                <v-btn text @click="next">К вопросу {{count}}</v-btn>
                            </v-card-actions>
                        
                    </v-card>
            </v-dialog> 
        </v-container>
</template>

<script>
  export default {
    data() {
        return {
            title: '',
            descrDoctor: '',
            descrPatient: '',
            selfVote: '',
            descrForSelfVote: '',
            voteCreateDialog: false,
            questionType: null,
            variants: ['1'],
            var_count: 1,
            variant1: "",
            variant2: "",
            count: 1,
            number: 1,
            vote: {
                title: '',
                descrDoctor: '',
                descrPatient: '',
                selfVote: '',
                descrForSelfVote: '',
                numberOfQuest: 0,
                questions: []
            }
        }
    },
    methods: {
        addVar() {
            let vars = [];
            for(let i = 1; i < this.var_count; i++) {
                if(document.getElementById(i) != undefined) vars.push(document.getElementById(i).value);
            }
            if(vars.indexOf("") == -1) this.variants.push(++this.var_count);
        },
        delVar(elem) {
            this.variants.splice(this.variants.indexOf(elem), 1);
        },
        questToQuest() {
            if(this.questionType == 'radio')
                this.vote.questions.push({
                    questionType: this.questionType,
                });
            else if(this.questionType == 'slider')
                this.vote.questions.push({
                    questionType: this.questionType,
                });
            this.vote.numberOfQuest++;
        },
        next() {
            if(this.questionType == 'radio') {
                let vars = [];
                for(let i = 1; i < this.var_count; i++) {
                    if(document.getElementById(i) != undefined) vars.push(document.getElementById(i).value);
                }
                this.vote.questions.push({
                    questionType: this.questionType,
                    variants: [this.variant1, this.variant2].concat(vars)
                });
                this.variants = ['1'];
                this.var_count = 1;
                this.variant1 = ""; this.variant2 = "";
            } else if(this.questionType == 'slider') {
                this.vote.questions.push({
                    questionType: this.questionType,
                });
                this.number = 0;
            } else if(this.count == 1) {
                this.vote.title = this.title;
                this.vote.descrDoctor = this.descrDoctor;
                this.vote.descrPatient = this.descrPatient;
                this.vote.selfVote = this.selfVote;
                this.vote.descrForSelfVote = this.descrForSelfVote;
            }

            this.$refs.form.reset(); 
            
            this.count++;
            this.questionType = null;
            console.log(this.vote);
        },
        createVote() {
            this.next();
        },
        clearVote() {
            this.count = 1;
            this.voteCreateDialog = false;
            this.title = '';
            this.descrDoctor = '';
            this.descrPatient = '';
            this.selfVote = '';
            this.descrForSelfVote = '';
            this.numberOfQuest = 0;
            this.questions = [];
        }
    }
  }
</script>
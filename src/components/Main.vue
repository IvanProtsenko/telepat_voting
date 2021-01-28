<template>
        <v-container id="back">
            <v-btn block large color="primary" @click="voteCreateDialog = true">Создать опрос</v-btn>
            <v-dialog v-model="voteCreateDialog" min-width="900" max-width="900" content-class="round">
                    <v-card style="border: 0px; border-radius: 0" class="createVote">
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
                    </v-card>
                    
                    <div v-for="(question, i) in questions" v-bind:key="i">
                        <v-card style="border: 0px; border-radius: 0" class="createVote">
                            <v-row>
                                <v-col>
                                    <v-card-title id="headline" class="justify-center">Вопрос {{i+1}}<v-spacer></v-spacer>
                                    <v-btn @click="delQuest(i)">Удалить</v-btn></v-card-title>
                                </v-col>
                            </v-row>
                            <v-card-text>
                                <v-text-field v-model="question.questionText" class="voteText" placeholder="Текст вопроса"></v-text-field>
                                <v-radio-group v-model="question.questionType">
                                    <v-radio
                                        label="Вопрос с выбором ответа"
                                        value="radio"
                                    ></v-radio>
                                    <v-radio
                                        label="Вопрос с ползунком"
                                        value="slider"
                                    ></v-radio>
                                    <v-radio
                                        label="Вопрос с цифрой"
                                        value="number"
                                    ></v-radio>
                                </v-radio-group>
                                <v-form ref="form">
                                    <v-template v-show="question.questionType == 'radio' || question.questionType == 'slider'">
                                        <v-row class="voteInput" v-for="(variant, j) in question.answers" v-bind:key="j">
                                            <v-col cols="11" style="display: inline-flex">
                                                <v-text-field v-model="variant.text" class="voteText" :placeholder="'Вариант '+(j+1)"></v-text-field>
                                                <v-btn v-if="question.answers.length > 2" @click="delVar(question, j)" outlined class="delete_var">Удалить</v-btn>
                                            </v-col>
                                        </v-row>
                                        <v-btn @click="addVar(question)">Добавить вариант</v-btn>
                                    </v-template>
                                    <v-template v-show="question.questionType == 'number'">
                                        <v-row class="voteInput">
                                            <v-col cols="11" style="display: inline-flex">
                                                <v-text-field v-model="question.lowerBorder" class="voteText" placeholder="Ограничения снизу (если есть)"></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row class="voteInput">
                                            <v-col cols="11" style="display: inline-flex">
                                                <v-text-field v-model="question.upperBorder" class="voteText" placeholder="Ограничения сверху (если есть)"></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-template>
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </div>

                    <div v-for="(reaction, i) in reactions" v-bind:key="i">
                        <v-card style="border: 0px; border-radius: 0">
                             <v-row>
                                <v-col>
                                    <v-card-title id="headline" class="justify-center">Реакция {{i+1}}<v-spacer></v-spacer>
                                    <v-btn @click="delReact(i)">Удалить</v-btn></v-card-title>
                                </v-col>
                            </v-row>
                        </v-card>
                        <v-card-text>
                            <v-row>
                                <v-col>
                                    <v-select
                                        v-model="reaction.question"
                                        :items="questionsForReact"
                                        :error-messages="errors"
                                        label="Выберите вопрос"
                                        data-vv-name="select"
                                        required
                                    ></v-select>
                                </v-col>
                                <v-col>
                                    <v-select
                                        v-model="reaction.label"
                                        :items="labels"
                                        :error-messages="errors"
                                        label="Выберите знак"
                                        data-vv-name="select"
                                        required
                                    ></v-select>
                                </v-col>
                                <v-col>
                                    
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </div>

                    <v-card style="border: 0px; border-radius: 0" class="createVote">
                        <v-card-actions>
                            <v-btn id="btn-add" text @click="addQuestion">Добавить вопрос</v-btn>
                            <v-spacer></v-spacer>
                            <v-btn id="btn-add" text @click="addReaction">Добавить реакции</v-btn>
                            <v-spacer></v-spacer>
                            <v-btn id="btn-add" text @click="create">Создать</v-btn>
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
            questions: [],
            questionsForReact: [],
            reactions: [],
            labels: ['>', '<', '=', '!=', '>=', '<='],
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
        addVar(quest) {
            quest.answers.push({text: ''});
        },
        delVar(quest, index) {
            quest.answers.splice(index, 1);
        },
        addQuestion() {
            this.questions.push({
                questionType: '',
                questionText: '',
                lowerBorder: null,
                upperBorder: null,
                answers: [{text: ''}, {text: ''}]
            });
            this.questionsForReact.push('Вопрос '+this.questions.length);
        },
        delQuest(index) {
            this.questions.splice(index, 1);
        },
        addReaction() {
            this.reactions.push({
                question: null,
                label: null,
            });
        },
        delReact(index) {
            this.reactions.splice(index, 1);
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

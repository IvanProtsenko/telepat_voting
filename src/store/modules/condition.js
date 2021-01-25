import api from '../../api';

export default {
    state: {},
    mutations: {},
    actions: { 
        SEND_CONFIG: async (context, args) => {
            try {
                const { data, status } = await api.sendConfig(args);

                if (status === 200) 
                    return data;
                else return {err: 'Не получилось отправить данные'};
            } catch(e) {return {err:e.toString()}}
        },
    }
}
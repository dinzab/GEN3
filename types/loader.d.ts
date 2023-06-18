import {Ref} from 'vue'
declare module 'vue' {
    interface Custom {
        $visible: Ref<Boolean>
    }
}
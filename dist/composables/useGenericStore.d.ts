import { StorageItemKey } from '@wxt-dev/storage';
import { Ref } from 'vue';
export type UpdateStateFn<S, E> = (state: Ref<S>, event: E) => void;
/**
 * 汎用的な状態管理と永続化を行うコンポーザブル関数。
 * * @template S 状態の型 (例: UserOption)
 * @template E 更新イベントの型 (例: UserOptionUpdateEvent)
 * @param key ストレージキー
 * @param getDefaultState 初期状態を返す関数
 * @param deserialize JSON文字列を状態オブジェクトに変換する関数
 * @param serialize 状態オブジェクトをJSON文字列に変換する関数
 * @param updateStateLogic 状態の更新ロジックを実行する関数
 * @returns 状態 (state) と状態更新関数 (updateState) を含むオブジェクト
 */
export declare function useGenericStore<S, E>(key: StorageItemKey, getDefaultState: () => S, deserialize: (json: string) => S, serialize: (state: S) => string, updateStateLogic: UpdateStateFn<S, E>): {
    state: Ref<S>;
    updateState: (event: E) => void;
};

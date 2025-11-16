/**
 * 複数のオブジェクトを順番にマージして 1 つのオブジェクトを返します。
 *
 * - 引数の順番が優先度を表し、**後ろのオブジェクトほど優先（上書き）**されます。
 * - すべてのオブジェクトは浅くマージ（shallow merge）されます。
 * - 同じキーが存在した場合、最後に指定されたオブジェクトの値で上書きされます。
 * - 配列プロパティは concat されず、単純に上書きされます。
 *
 * @template T オブジェクトの型
 * @param {...Partial<T>[]} objs マージするオブジェクト群。前のものほど優先度が低く、後のものが上書きします。
 * @returns {T} マージ後の新しいオブジェクト（元のオブジェクトは変更しません）
 */
export declare function applyDefaultProperties<T extends object>(...objs: Partial<T>[]): T;

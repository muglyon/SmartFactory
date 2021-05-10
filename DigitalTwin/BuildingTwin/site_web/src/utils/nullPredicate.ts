export default function isNotNullFilter<T>(obj: T | null): obj is T {
    return obj !== null;
}
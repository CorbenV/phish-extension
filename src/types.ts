export interface PhishResponse {
	verdict: "SAFE" | "WARNING" | "UNSAFE";
	message: string;
}

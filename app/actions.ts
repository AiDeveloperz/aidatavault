"use server";

export async function verifyAccessCode(code: string): Promise<boolean> {
	if (!code) return false;
	
	const validCodesStr = process.env.INVITE_CODES || '';
	// Split by comma, trim whitespace
	const validCodes = validCodesStr.split(',').map((c) => c.trim().toUpperCase());
	
	return validCodes.includes(code.trim().toUpperCase());
}

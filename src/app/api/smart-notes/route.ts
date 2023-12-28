import { NextRequest, NextResponse } from "next/server";
import * as fs from 'fs';


export async function POST(req: NextRequest) {
  try {
    // Access the request body and ensure it's an object
    const {smartNotes} = await req.json();

     
      const jsonData = JSON.stringify(smartNotes, null, 2); // The third argument (2) is for indentation
      console.log(jsonData)
      // Write the JSON data to the file
      await fs.writeFileSync('smarnotes.json', jsonData);

  
      console.log("JSON data saved successfully")
      return NextResponse.json({
        message: "JSON data saved successfully",
      });


  } catch (error) {
    console.error("Error smart notes:", error);
    return NextResponse.json({ error });
  }
}

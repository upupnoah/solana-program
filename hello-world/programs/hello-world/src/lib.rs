use anchor_lang::prelude::*;

declare_id!("9WZp25U3YHbMqzEX6b7SQFhaU119Mk6Qu5yFHJjBn2PN");

#[program]
pub mod hello_world {
    use super::*;

    pub fn hello(ctx: Context<Hello>) -> Result<()> {
        msg!("Hello World!");
        Ok(())
    }
    
}

#[derive(Accounts)]
pub struct Hello {}

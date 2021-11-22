export const Data = {
    pricingTable:[
        {   
            id: 1,
            price: 1,
            credits: 30,
        },
        
        {   
            id: 2,
            price: 200,
            credits: 40,
        },

        {   
            id: 3,  
            price: 300,
            credits: 60,
        },

        {   
            id: 4,
            price: 350,
            credits: 70,
        },
    ],
    alterData: {
        using: {
            adminId:"6195c3427f82ab43b9e571ed",
            url: 'http://localhost:8000/graphql',
            payment:"sandbox",
        },
        other:{
            adminId:"616c5a56d4b61b864bfc72c7",
            url:'https://resellerpanel.info/api',
            payment:"production",
        }
    }
    
    
};
// When the instance is mounted, it will deliver event from product-review(grand-child) to product
var eventBus = new Vue()

// Product Tabs component
Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: true
        }
    },
    template: `
        <div>
            <span class="tab" 
                :class="{ activeTab: selectedTab === tab}"
                v-for="(tab, index) in tabs" 
                :key="index"
                @click="selectedTab = tab"
                >
                {{ tab }}
            </span>

            <div v-show="selectedTab === 'Reviews'">
                <h2>Reviews</h2>
                <p v-if="reviews.length==0">There are no reviews yet.</p>
                <ul v-else>
                    <li v-for="review in reviews">
                        {{review.name}}
                        {{review.rating}}
                        {{review.review}}
                    </li>
                </ul>
            </div>

            <product-review v-show="selectedTab === 'Make a reviews'"></product-review>
        </div>
    `,
    data(){
        return{
            tabs: ['Reviews', 'Make a reviews'],
            selectedTab: 'Reviews'
        }
    }
})


// Product review component
Vue.component('product-review', {
    template: `
        <form class="review-form" @submit.prevent="onSubmit">
            <p>
                <label for="name">Name: </label>
                <input id="name" v-model="name" required>
            </p>

            <p>
                <label for="review">Review: </label>
                <textarea id="review" v-model="review" required></textarea>
            </p>

            <p>
                <label for="rating">Rating:</label>
                <select id="rating" v-model.number="rating" required>
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
            </p>  

            <p>
                <input type="submit" value="Submit">
            </p>
        </form>        
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null
        }
    },
    methods: {
        onSubmit() {
            let productReview = {
                name: this.name,
                review: this.review,
                rating: this.rating
            }
            // emit event to product component
            // this.$emit('review-submitted', productReview)

            // event bus instead
            eventBus.$emit('review-submitted', productReview)

            this.name = null
            this.review = null
            this.rating = null
        }
    }
})

// Product component
Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
        <div class="product">
            <div class="product-image">
                <img :src="image" :alt="description"></img>
            </div>

            <div class="product-info">
                <h1>{{title}} <span v-show="onSale">On Sale!</span></h1>
                <p v-if="inStock > 10">In stock has {{inStock}} socks</p>
                <p v-else-if="inStock<=10 && inventory>0">Almost sold out</p>
                <p v-else class="outStock">Out of stock</p>
                <p>Shipping: {{ shipping }}</p>

                <ul>
                    <li v-for="detail in details">{{detail}}</li>
                </ul>

                <div
                    v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    class="color-box"
                    :style="{ backgroundColor: variant.variantColor }"
                    @mouseover="updateProduct(index)"
                ></div>

                <p>Sizes:</p>
                <ul>
                    <li v-for="size in sizes">{{size}}</li>
                </ul>

                <div style="display: flex; flex-wrap: wrap">
                    <button
                        :class="{disabledButton: !inStock}"
                        @click="addToCart"
                        style="margin: 10px"
                        :disabled="!inStock"
                    >
                        Add to Cart
                    </button>

                    <button
                        :class="{disabledButton: !inStock}"
                        @click="decCart"
                        style="margin: 10px"
                        :disabled="!inStock"
                    >
                        Decrement cart
                    </button>
                </div>
            </div>

            <product-tabs :reviews="reviews"></product-tabs>
        </div>`,
    data() {
        return {
            brand: 'Vue Mastery',
            product: 'Socks',
            description: 'This is sock',
            selectedVariant: 0,
            link: 'https://google.com',
            onSale: true,
            inventory: 0,
            details: ["80% contton", "20% polyester", 'Gender-neutral'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: "green",
                    variantImage: "./assets/vmSocks-green.jpeg",
                    variantQuantity: 100,
                },
                {
                    variantId: 2235,
                    variantColor: "blue",
                    variantImage: "./assets/vmSocks-blue.jpeg",
                    variantQuantity: 0
                },
            ],
            sizes: ['small', 'big', 'very big'],
            
            outStockObject: {
                'text-decoration': 'line-through',
                color: '#16C0B0'
            },
            reviews: []
        }
    },
    methods: {
        addToCart() {
            // this.cart+=1;
            // emit event to parent
            this.$emit('add-to-cart')
        },
        updateProduct(index){
            this.selectedVariant = index;
        },
        decCart(){
            // this.cart-=1;
            this.$emit('dec-to-cart')
        },
        // addReview(productReview){
        //     console.log(productReview)
        //     this.reviews.push(productReview)
        // }
    },
    computed: {
        title(){
            return this.brand + ' ' + this.product;
        },
        image(){
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity;
        },
        shipping(){
            if(this.premium) {
                return "Free"
            }
            return 2.99
        }
    },
    // the place to put code that we want to run as soon as a component is mounted to the DOM
    mounted() {
        // listen on review submmited event
        eventBus.$on("review-submitted", productReview => {
            console.log(productReview)
            this.reviews.push(productReview)
        })
    },
})

var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        details: ["product1", "product2"],
        cart: 0,
    },
    methods: {
        updateCart() {
            this.cart+=1
        },
        decCart(){
            if (this.cart <= 0) {
                return this.cart = 0
            } 
            this.cart--   
        }
    }
})

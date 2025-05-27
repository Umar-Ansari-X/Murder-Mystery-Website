from flask import Flask, render_template, jsonify, request, session
import random
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), 'static', 'data'))


import place_data
import suspects
import options



app = Flask(__name__)

app.secret_key = 'my_secret_ke'


times = ['12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM']
colors = ['#53d1fe', '#40a2e0', '#2562b6', '#0f2b92', '#00067b']






def randomize_item(list1):



    list1muder = list1['murdererCard']
    list1weapon = list1['weaponCard']
    list1method = list1['murderMethodCard']

    random.shuffle(list1muder)
    random.shuffle(list1weapon)

    random.shuffle(list1method)


    shuffled_list1 = {


    'murdererCard': list1muder,
    'weaponCard': list1weapon,
    'murderMethodCard': list1method
}



    return shuffled_list1

@app.route('/get_story_data/<story_id>')
def get_story_data(story_id):

    images = [
                'library.png', 'cafe.png', 'cinema.png', 'garage.png', 'gym.png',
                'home.png', 'mall.png', 'office.png', 'park.png', 'townhall.png'
            ]

    if story_id == 'story1':

        random.shuffle(images)

        card_options_x = options.card_options



        card_options_x = randomize_item(card_options_x)

        data = {
            'location_texts': place_data.location_texts,
            'times': times,
            'colors': colors,
            'card_options': card_options_x,
            'correct_options':  options.correct_options,
            'images': images,
            'exampleSuspects': suspects.suspects1
        }









    elif story_id == 'story2':

        random.shuffle(images)

        card_options_x =  options.card_options1



        card_options_x = randomize_item(card_options_x)

        data = {
            'location_texts':  place_data.location_texts1,
            'times': times,
            'colors': colors,
            'card_options': card_options_x,
            'correct_options':  options.correct_options1,
            'images': images,
            'exampleSuspects': suspects.suspects2
        }
    elif story_id == 'story3':

        random.shuffle(images)

        card_options_x =  options.card_options2



        card_options_x = randomize_item(card_options_x)


        data = {
            'location_texts':  place_data.location_texts2,
            'times': times,
            'colors': colors,
            'card_options': card_options_x,
            'correct_options':  options.correct_options2,
            'images': images,
            'exampleSuspects': suspects.suspects3
        }
    else:
        data = {'error': 'Invalid story ID'}
    
    return jsonify(data)



@app.route('/')
def index():
    
    return render_template('index.html')



@app.route('/complete_case', methods=['POST'])
def complete_case():
    data = request.get_json()
    case_id = data.get('case_id')

    if 'completed_cases' not in session:
        session['completed_cases'] = []

    if case_id not in session['completed_cases']:
        session['completed_cases'].append(case_id)

    
    print(session)


    return jsonify({'status': 'success'}), 200


@app.route('/get_completed_cases', methods=['GET'])
def get_completed_cases():
    completed_cases = session.get('completed_cases', [])

    return jsonify({'completed_cases': completed_cases}), 200

if __name__ == '__main__':
    app.run(debug=True)